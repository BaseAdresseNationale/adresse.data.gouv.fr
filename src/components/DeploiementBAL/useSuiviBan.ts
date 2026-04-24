import { useCallback, useEffect, useRef, useState } from 'react'
import { MapRef } from 'react-map-gl/maplibre'

const SUIVI_BAN_API = process.env.NEXT_PUBLIC_SUIVI_BAN_API_URL || 'https://suivi-ban.mut-dev.ign.fr/api'
const ENABLE_HOVER = true

const TERRITOIRES: Record<string, { lat: number, lon: number, zoom: number, nom: string }> = {
  971: { lat: 16.265, lon: -61.551, zoom: 9, nom: 'Guadeloupe' },
  972: { lat: 14.641, lon: -61.024, zoom: 10, nom: 'Martinique' },
  973: { lat: 3.933, lon: -53.125, zoom: 7, nom: 'Guyane' },
  974: { lat: -21.115, lon: 55.536, zoom: 10, nom: 'La Réunion' },
  976: { lat: -12.827, lon: 45.166, zoom: 10, nom: 'Mayotte' },
  975: { lat: 46.833, lon: -56.333, zoom: 7, nom: 'Saint-Pierre-et-Miquelon' },
  977: { lat: 17.900, lon: -62.833, zoom: 11, nom: 'Saint-Barthélemy' },
  978: { lat: 18.070, lon: -63.050, zoom: 11, nom: 'Saint-Martin' },
  988: { lat: -22.276, lon: 166.457, zoom: 7, nom: 'Nouvelle-Calédonie' },
  987: { lat: -17.679, lon: -149.406, zoom: 7, nom: 'Polynésie française' },
  986: { lat: -13.293, lon: -176.199, zoom: 7, nom: 'Wallis-et-Futuna' },
}

export type SuiviBanSelectedDept = { code: string, nom: string }

export type HoveredDept = {
  code: string
  nom: string
  vert: number
  orange: number
  rouge: number
  gris: number
  total: number
  x: number
  y: number
}

export type HoveredCommune = {
  code: string
  nom: string
  statut: string
  nb_numeros: number
  nb_voies: number
  producteur?: string
  x: number
  y: number
}

type DeptStats = {
  total: number
  vert: number
  orange: number
  rouge: number
  gris: number
}

type Bounds = [[number, number], [number, number]]

function getCommuneCoordinates(commune: any): [number, number] | null {
  const lon = Number(commune?.lon)
  const lat = Number(commune?.lat)
  return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null
}

function normalizeCode(code: unknown): string {
  const raw = String(code || '').trim().toUpperCase()
  if (raw === '2A' || raw === '2B') return raw
  if (/^\d+$/.test(raw)) {
    if (raw.length === 1) return raw.padStart(2, '0')
    return raw
  }
  return raw
}

function toNumber(value: unknown): number {
  const n = Number(value || 0)
  return Number.isFinite(n) ? n : 0
}

function normalizeDeptStatsMap(input: Record<string, any>): Record<string, DeptStats> {
  const output: Record<string, DeptStats> = {}
  Object.entries(input || {}).forEach(([rawCode, value]) => {
    const code = normalizeCode(rawCode)
    output[code] = {
      total: toNumber(value?.total),
      vert: toNumber(value?.vert),
      orange: toNumber(value?.orange),
      rouge: toNumber(value?.rouge),
      gris: toNumber(value?.gris),
    }
  })
  return output
}

function normalizeBounds(raw: any): Bounds | null {
  if (raw && Array.isArray(raw.southwest) && Array.isArray(raw.northeast)) {
    const sw = raw.southwest.map(Number)
    const ne = raw.northeast.map(Number)
    if (sw.length >= 2 && ne.length >= 2 && Number.isFinite(sw[0]) && Number.isFinite(sw[1]) && Number.isFinite(ne[0]) && Number.isFinite(ne[1])) {
      return [[Math.min(sw[1], ne[1]), Math.min(sw[0], ne[0])], [Math.max(sw[1], ne[1]), Math.max(sw[0], ne[0])]]
    }
  }

  if (!Array.isArray(raw) || raw.length !== 2 || !Array.isArray(raw[0]) || !Array.isArray(raw[1])) {
    return null
  }

  const p1 = raw[0].map(Number)
  const p2 = raw[1].map(Number)
  if (p1.length < 2 || p2.length < 2 || !Number.isFinite(p1[0]) || !Number.isFinite(p1[1]) || !Number.isFinite(p2[0]) || !Number.isFinite(p2[1])) {
    return null
  }

  const looksLikeLatLng = Math.abs(p1[0]) <= 90 && Math.abs(p1[1]) <= 180 && Math.abs(p2[0]) <= 90 && Math.abs(p2[1]) <= 180
  const sw: [number, number] = looksLikeLatLng ? [p1[1], p1[0]] : [p1[0], p1[1]]
  const ne: [number, number] = looksLikeLatLng ? [p2[1], p2[0]] : [p2[0], p2[1]]

  const minLng = Math.min(sw[0], ne[0])
  const minLat = Math.min(sw[1], ne[1])
  const maxLng = Math.max(sw[0], ne[0])
  const maxLat = Math.max(sw[1], ne[1])
  return [[minLng, minLat], [maxLng, maxLat]]
}

interface UseSuiviBanOptions {
  selectedTab: string
}

export function useSuiviBan({ selectedTab }: UseSuiviBanOptions) {
  const mapRef = useRef<MapRef>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [suiviBanSelectedDept, setSuiviBanSelectedDept] = useState<SuiviBanSelectedDept | null>(null)
  const [suiviBanDeptStats, setSuiviBanDeptStats] = useState<Record<string, DeptStats>>({})
  const [suiviBanCommunesMeta, setSuiviBanCommunesMeta] = useState<any[]>([])
  const [suiviBanLoadingCommunes, setSuiviBanLoadingCommunes] = useState(false)
  const [suiviBanCommunesError, setSuiviBanCommunesError] = useState(false)
  const [suiviBanCommuneTilesEmpty, setSuiviBanCommuneTilesEmpty] = useState(false)
  const [suiviBanSelectedCommune, setSuiviBanSelectedCommune] = useState<any>(null)
  const [suiviBanActiveStatuts, setSuiviBanActiveStatuts] = useState<string[]>(['rouge', 'orange', 'vert', 'gris'])
  const [suiviBanProducteurFilter, setSuiviBanProducteurFilter] = useState<string | null>(null)
  const [suiviBanProducteurs, setSuiviBanProducteurs] = useState<any[]>([])
  const [hoveredDept, setHoveredDept] = useState<HoveredDept | null>(null)
  const [hoveredCommune, setHoveredCommune] = useState<HoveredCommune | null>(null)
  const deptStatsCacheRef = useRef<Map<string, Record<string, DeptStats>>>(new Map())
  const boundsCacheRef = useRef<Map<string, Bounds | null>>(new Map())
  const communesMetaCacheRef = useRef<Map<string, any[]>>(new Map())
  const skipNextFitBoundsRef = useRef(false)
  const hoveredDeptCodeRef = useRef<string | null>(null)
  const hoveredCommuneCodeRef = useRef<string | null>(null)
  const isMapNavigatingRef = useRef(false)

  useEffect(() => {
    if (selectedTab !== 'suivi-ban' || suiviBanProducteurs.length > 0) return
    fetch(`${SUIVI_BAN_API}/producteurs`)
      .then(r => r.json())
      .then(data => setSuiviBanProducteurs(data || []))
      .catch(e => console.error('Producteurs load error:', e))
  }, [selectedTab, suiviBanProducteurs.length])

  useEffect(() => {
    if (selectedTab !== 'suivi-ban') return

    const cacheKey = suiviBanProducteurFilter || '__all__'
    const cached = deptStatsCacheRef.current.get(cacheKey)
    if (cached) {
      setSuiviBanDeptStats(cached)
      return
    }

    let cancelled = false
    async function loadDeptStats() {
      try {
        const statsUrl = suiviBanProducteurFilter
          ? `${SUIVI_BAN_API}/producteur/${encodeURIComponent(suiviBanProducteurFilter)}/departements`
          : `${SUIVI_BAN_API}/stats/departements`
        const res = await fetch(statsUrl)
        if (!res.ok) throw new Error(`Stats départements HTTP ${res.status}`)
        const data = await res.json()
        if (cancelled) return

        const normalized = normalizeDeptStatsMap(data || {})
        deptStatsCacheRef.current.set(cacheKey, normalized)
        setSuiviBanDeptStats(normalized)
      }
      catch (e) {
        console.error('Suivi BAN stats départements error:', e)
      }
    }
    loadDeptStats()

    return () => {
      cancelled = true
    }
  }, [selectedTab, suiviBanProducteurFilter])

  useEffect(() => {
    if (!suiviBanSelectedDept) return

    const controller = new AbortController()
    setSuiviBanLoadingCommunes(true)
    setSuiviBanCommunesError(false)
    setSuiviBanCommuneTilesEmpty(false)

    const deptCode = normalizeCode(suiviBanSelectedDept.code)

    const loadBounds = async (): Promise<Bounds | null> => {
      if (boundsCacheRef.current.has(deptCode)) {
        return boundsCacheRef.current.get(deptCode) ?? null
      }
      const response = await fetch(`${SUIVI_BAN_API}/departement/${deptCode}/bounds`, { signal: controller.signal })
      if (!response.ok) {
        boundsCacheRef.current.set(deptCode, null)
        return null
      }
      const rawBounds = await response.json()
      const normalized = normalizeBounds(rawBounds)
      boundsCacheRef.current.set(deptCode, normalized)
      return normalized
    }

    const loadCommunesMeta = async (): Promise<any[]> => {
      const cached = communesMetaCacheRef.current.get(deptCode)
      if (cached) return cached
      const response = await fetch(`${SUIVI_BAN_API}/departement/${deptCode}/communes-meta`, { signal: controller.signal })
      if (!response.ok) {
        throw new Error(`Communes meta API error (${response.status})`)
      }
      const payload = await response.json()
      const list = Array.isArray(payload)
        ? payload
        : (Array.isArray(payload?.communes) ? payload.communes : [])
      communesMetaCacheRef.current.set(deptCode, list)
      return list
    }

    Promise.allSettled([loadBounds(), loadCommunesMeta()])
      .then(([boundsResult, communesMetaResult]) => {
        if (controller.signal.aborted) return

        if (communesMetaResult.status === 'fulfilled') {
          setSuiviBanCommunesMeta(communesMetaResult.value)
          setSuiviBanCommunesError(false)
        }
        else {
          const err = communesMetaResult.reason as Error
          if (err?.name !== 'AbortError') {
            console.error('Département communes-meta load error:', err)
            setSuiviBanCommunesError(true)
          }
        }

        if (boundsResult.status === 'fulfilled') {
          const bounds = boundsResult.value
          if (bounds) {
            if (!skipNextFitBoundsRef.current) {
              mapRef.current?.fitBounds(bounds, { padding: 40, duration: 800 })
            }
            skipNextFitBoundsRef.current = false
          }
        }
        else {
          const err = boundsResult.reason as Error
          if (err?.name !== 'AbortError') {
            console.warn('Département bounds load error:', deptCode, err?.message || err)
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSuiviBanLoadingCommunes(false)
        }
      })

    return () => controller.abort()
  }, [suiviBanSelectedDept])

  useEffect(() => {
    if (!ENABLE_HOVER) return
    if (selectedTab !== 'suivi-ban') {
      isMapNavigatingRef.current = false
      return
    }
    const map = mapRef.current?.getMap()
    if (!map) return

    let releaseTimer: ReturnType<typeof setTimeout> | null = null
    const lockNavigation = () => {
      isMapNavigatingRef.current = true
      setHoveredDept(null)
      setHoveredCommune(null)
      hoveredDeptCodeRef.current = null
      hoveredCommuneCodeRef.current = null
      if (releaseTimer) {
        clearTimeout(releaseTimer)
        releaseTimer = null
      }
    }
    const unlockNavigationSoon = () => {
      if (releaseTimer) clearTimeout(releaseTimer)
      releaseTimer = setTimeout(() => {
        isMapNavigatingRef.current = false
      }, 120)
    }

    map.on('movestart', lockNavigation)
    map.on('zoomstart', lockNavigation)
    map.on('pitchstart', lockNavigation)
    map.on('rotatestart', lockNavigation)
    map.on('moveend', unlockNavigationSoon)
    map.on('zoomend', unlockNavigationSoon)
    map.on('idle', unlockNavigationSoon)

    return () => {
      map.off('movestart', lockNavigation)
      map.off('zoomstart', lockNavigation)
      map.off('pitchstart', lockNavigation)
      map.off('rotatestart', lockNavigation)
      map.off('moveend', unlockNavigationSoon)
      map.off('zoomend', unlockNavigationSoon)
      map.off('idle', unlockNavigationSoon)
      if (releaseTimer) clearTimeout(releaseTimer)
      isMapNavigatingRef.current = false
    }
  }, [selectedTab])

  useEffect(() => {
    if (!ENABLE_HOVER) {
      setHoveredDept(null)
      hoveredDeptCodeRef.current = null
      return
    }
    if (selectedTab !== 'suivi-ban' || suiviBanSelectedDept) {
      setHoveredDept(null)
      hoveredDeptCodeRef.current = null
      return
    }
    const map = mapRef.current?.getMap()
    if (!map) return

    let rafId: number | null = null
    let queuedHover: HoveredDept | null = null
    const flushHover = () => {
      setHoveredDept(queuedHover)
      rafId = null
    }

    const queueHoverUpdate = (next: HoveredDept | null) => {
      queuedHover = next
      if (rafId === null) {
        rafId = window.requestAnimationFrame(flushHover)
      }
    }

    const onLayerMove = (e: any) => {
      if (isMapNavigatingRef.current || map.isMoving() || map.isZooming()) {
        clearDeptHover()
        return
      }
      const feature = e.features?.[0]
      if (!feature?.properties) return
      const p = feature.properties as any
      const code = normalizeCode(p.code)
      const stats = suiviBanDeptStats[code] || { vert: 0, orange: 0, rouge: 0, gris: 0, total: 0 }
      hoveredDeptCodeRef.current = code
      queueHoverUpdate({
        code,
        nom: p.nom || code,
        vert: toNumber(stats.vert),
        orange: toNumber(stats.orange),
        rouge: toNumber(stats.rouge),
        gris: toNumber(stats.gris),
        total: toNumber(stats.total),
        x: e.point.x,
        y: e.point.y,
      })
    }

    const clearDeptHover = () => {
      hoveredDeptCodeRef.current = null
      queueHoverUpdate(null)
    }

    const bindIfReady = () => {
      if (!map.getLayer('suivi-ban-dept-fill')) return false
      map.on('mousemove', 'suivi-ban-dept-fill', onLayerMove)
      map.on('mouseleave', 'suivi-ban-dept-fill', clearDeptHover)
      map.on('zoomstart', clearDeptHover)
      map.on('movestart', clearDeptHover)
      return true
    }

    if (!bindIfReady()) {
      map.once('styledata', bindIfReady)
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      map.off('mousemove', 'suivi-ban-dept-fill', onLayerMove)
      map.off('mouseleave', 'suivi-ban-dept-fill', clearDeptHover)
      map.off('zoomstart', clearDeptHover)
      map.off('movestart', clearDeptHover)
      setHoveredDept(null)
      hoveredDeptCodeRef.current = null
    }
  }, [selectedTab, suiviBanSelectedDept, suiviBanDeptStats])

  useEffect(() => {
    if (!ENABLE_HOVER) {
      setHoveredCommune(null)
      hoveredCommuneCodeRef.current = null
      return
    }
    if (selectedTab !== 'suivi-ban' || !suiviBanSelectedDept) {
      setHoveredCommune(null)
      hoveredCommuneCodeRef.current = null
      return
    }
    const map = mapRef.current?.getMap()
    if (!map) return

    let rafId: number | null = null
    let queuedHover: HoveredCommune | null = null
    const flushHover = () => {
      setHoveredCommune(queuedHover)
      rafId = null
    }

    const queueHoverUpdate = (next: HoveredCommune | null) => {
      queuedHover = next
      if (rafId === null) {
        rafId = window.requestAnimationFrame(flushHover)
      }
    }

    const onLayerMove = (e: any) => {
      if (isMapNavigatingRef.current || map.isMoving() || map.isZooming()) {
        clearCommuneHover()
        return
      }
      const feature = e.features?.[0]
      if (!feature?.properties) return
      const p = feature.properties as any
      const code = normalizeCode(p.code)
      hoveredCommuneCodeRef.current = code
      queueHoverUpdate({
        code,
        nom: p.nom || code,
        statut: p.statut || 'gris',
        nb_numeros: Number(p.nb_numeros || 0),
        nb_voies: Number(p.nb_voies || 0),
        producteur: p.producteur,
        x: e.point.x,
        y: e.point.y,
      })
    }

    const clearCommuneHover = () => {
      hoveredCommuneCodeRef.current = null
      queueHoverUpdate(null)
    }

    const bindIfReady = () => {
      if (!map.getLayer('suivi-ban-commune-fill')) return false
      map.on('mousemove', 'suivi-ban-commune-fill', onLayerMove)
      map.on('mouseleave', 'suivi-ban-commune-fill', clearCommuneHover)
      map.on('zoomstart', clearCommuneHover)
      map.on('movestart', clearCommuneHover)
      return true
    }

    if (!bindIfReady()) {
      map.once('styledata', bindIfReady)
    }

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
      map.off('mousemove', 'suivi-ban-commune-fill', onLayerMove)
      map.off('mouseleave', 'suivi-ban-commune-fill', clearCommuneHover)
      map.off('zoomstart', clearCommuneHover)
      map.off('movestart', clearCommuneHover)
      setHoveredCommune(null)
      hoveredCommuneCodeRef.current = null
    }
  }, [selectedTab, suiviBanSelectedDept])

  useEffect(() => {
    if (selectedTab !== 'suivi-ban' || !suiviBanSelectedDept) {
      setSuiviBanCommuneTilesEmpty(false)
      return
    }

    const map = mapRef.current?.getMap()
    if (!map) return

    const evaluateLoadedTiles = () => {
      if (!map.getSource('suivi-ban-communes')) return
      if (!map.isSourceLoaded('suivi-ban-communes')) return

      const features = map.querySourceFeatures('suivi-ban-communes', { sourceLayer: 'communes' })
      setSuiviBanCommuneTilesEmpty(features.length === 0)
    }

    map.on('idle', evaluateLoadedTiles)
    map.on('moveend', evaluateLoadedTiles)
    evaluateLoadedTiles()

    return () => {
      map.off('idle', evaluateLoadedTiles)
      map.off('moveend', evaluateLoadedTiles)
    }
  }, [selectedTab, suiviBanSelectedDept, suiviBanActiveStatuts, suiviBanProducteurFilter])

  const fitToDepartment = useCallback(async (code: string) => {
    const deptCode = normalizeCode(code)
    const map = mapRef.current
    if (!map) return

    try {
      if (!boundsCacheRef.current.has(deptCode)) {
        const response = await fetch(`${SUIVI_BAN_API}/departement/${deptCode}/bounds`)
        if (response.ok) {
          const rawBounds = await response.json()
          boundsCacheRef.current.set(deptCode, normalizeBounds(rawBounds))
        }
        else {
          boundsCacheRef.current.set(deptCode, null)
        }
      }

      const bounds = boundsCacheRef.current.get(deptCode) ?? null
      if (bounds) {
        map.fitBounds(bounds, { padding: 40, duration: 700 })
        return
      }
    }
    catch (e) {
      console.warn('Department fit bounds failed:', deptCode, e)
    }

    const territoire = TERRITOIRES[deptCode]
    if (territoire) {
      map.flyTo({ center: [territoire.lon, territoire.lat], zoom: territoire.zoom, duration: 700 })
    }
  }, [])

  const handleCommuneClick = useCallback(async (commune: any) => {
    setSuiviBanSelectedCommune(commune)
    let enriched = commune
    let coordinates = getCommuneCoordinates(enriched)

    if (!coordinates && commune?.code) {
      try {
        const response = await fetch(`${SUIVI_BAN_API}/commune/${encodeURIComponent(commune.code)}`)
        if (response.ok) {
          const full = await response.json()
          if (full && typeof full === 'object') {
            enriched = { ...full, ...commune }
            setSuiviBanSelectedCommune(enriched)
            coordinates = getCommuneCoordinates(enriched)
          }
        }
      }
      catch (e) {
        console.warn('Commune detail load error:', commune?.code, e)
      }
    }

    if (coordinates) {
      mapRef.current?.flyTo({ center: coordinates, zoom: 13, duration: 600 })
    }
  }, [mapRef])

  const handleMapClick = useCallback((e: any) => {
    if (selectedTab !== 'suivi-ban') return
    const features = e.features || []

    const communeFeature = features.find((f: any) => f.layer?.id === 'suivi-ban-commune-fill')
    if (communeFeature?.properties) {
      void handleCommuneClick(communeFeature.properties)
      return
    }

    const deptFeature = features.find((f: any) => f.layer?.id === 'suivi-ban-dept-fill')
    if (deptFeature?.properties) {
      const code = normalizeCode(deptFeature.properties.code)
      const nom = deptFeature.properties.nom || code
      const isNewDept = !suiviBanSelectedDept || suiviBanSelectedDept.code !== code
      if (isNewDept) {
        skipNextFitBoundsRef.current = false
        setSuiviBanSelectedDept({ code, nom })
        setSuiviBanSelectedCommune(null)
        setSuiviBanCommunesMeta([])
      }
      return
    }

    if (suiviBanSelectedDept) {
      setSuiviBanSelectedCommune(null)
      return
    }
  }, [selectedTab, suiviBanSelectedDept, handleCommuneClick])

  const handleSearchSelect = useCallback((commune: any) => {
    if (commune.dept && commune.dept_nom) {
      skipNextFitBoundsRef.current = true
      setSuiviBanSelectedDept({ code: normalizeCode(commune.dept), nom: commune.dept_nom })
    }
    setSuiviBanSelectedCommune(commune)
    const coordinates = getCommuneCoordinates(commune)
    if (coordinates) {
      mapRef.current?.flyTo({ center: coordinates, zoom: 12, duration: 800 })
    }
  }, [mapRef])

  const handleTerritorySelect = useCallback((code: string) => {
    if (!code) return
    const territoire = TERRITOIRES[code]
    if (!territoire) return
    skipNextFitBoundsRef.current = true
    mapRef.current?.flyTo({ center: [territoire.lon, territoire.lat], zoom: territoire.zoom, duration: 1000 })
    setSuiviBanSelectedDept({ code, nom: territoire.nom })
    setSuiviBanCommunesMeta([])
    setSuiviBanSelectedCommune(null)
  }, [mapRef])

  const handleBackToDepartment = useCallback(() => {
    setSuiviBanSelectedCommune(null)
    if (suiviBanSelectedDept) {
      void fitToDepartment(suiviBanSelectedDept.code)
    }
  }, [suiviBanSelectedDept, fitToDepartment])

  const handleBack = useCallback(() => {
    setSuiviBanSelectedDept(null)
    setSuiviBanCommunesMeta([])
    setSuiviBanLoadingCommunes(false)
    setSuiviBanCommunesError(false)
    setSuiviBanCommuneTilesEmpty(false)
    setSuiviBanSelectedCommune(null)
    setSuiviBanActiveStatuts(['rouge', 'orange', 'vert', 'gris'])
    setSuiviBanProducteurFilter(null)
    mapRef.current?.flyTo({ center: [2, 47], zoom: 5, duration: 800 })
  }, [mapRef])

  const balPaintLayer: 'source' | 'bal' = selectedTab === 'suivi-ban'
    ? 'source'
    : (selectedTab as 'source' | 'bal')

  useEffect(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    const hideForSuiviBan = selectedTab === 'suivi-ban'
    const balVisibility = hideForSuiviBan ? 'none' : 'visible'
    const adminVisibility = hideForSuiviBan ? 'none' : 'visible'
    const adminLayerIds = ['communes', 'departements', 'regions']
    const apply = () => {
      if (map.getLayer('bal-polygon-fill')) {
        map.setLayoutProperty('bal-polygon-fill', 'visibility', balVisibility)
      }
      adminLayerIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', adminVisibility)
        }
      })
      if (hideForSuiviBan && map.getLayer('bal-polygon-fill')) {
        // Place la couche Suivi BAN au-dessus du fond carto pour éviter les artefacts de superposition.
        if (map.getLayer('suivi-ban-dept-fill')) {
          map.moveLayer('suivi-ban-dept-fill')
        }
        if (map.getLayer('suivi-ban-commune-fill')) {
          map.moveLayer('suivi-ban-commune-fill')
        }
      }
    }
    if (map.isStyleLoaded()) apply()
    else map.once('styledata', apply)
  }, [selectedTab])

  const interactiveLayerIds = suiviBanSelectedDept
    ? ['suivi-ban-commune-fill']
    : ['suivi-ban-dept-fill']

  return {
    mapRef,
    mapContainerRef,
    interactiveLayerIds,
    balPaintLayer,
    suiviBanDeptStats,
    suiviBanSelectedDept,
    suiviBanCommunesMeta,
    suiviBanLoadingCommunes,
    suiviBanCommunesError,
    suiviBanCommuneTilesEmpty,
    suiviBanSelectedCommune,
    setSuiviBanSelectedCommune,
    suiviBanActiveStatuts,
    setSuiviBanActiveStatuts,
    suiviBanProducteurFilter,
    setSuiviBanProducteurFilter,
    suiviBanProducteurs,
    handleMapClick,
    handleCommuneClick,
    handleSearchSelect,
    handleTerritorySelect,
    handleBackToDepartment,
    handleBack,
    hoveredDept: ENABLE_HOVER ? hoveredDept : null,
    hoveredCommune: ENABLE_HOVER ? hoveredCommune : null,
  }
}

export type SuiviBanContext = ReturnType<typeof useSuiviBan>
