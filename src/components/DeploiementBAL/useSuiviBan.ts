import { useCallback, useEffect, useRef, useState } from 'react'
import { MapRef } from 'react-map-gl/maplibre'

import { fr } from '@codegouvfr/react-dsfr'

const SUIVI_BAN_API = process.env.NEXT_PUBLIC_SUIVI_BAN_API_URL || 'https://suivi-ban.mut-dev.ign.fr/api'

const DSFR_HEX = fr.colors.getHex({ isDark: false }).decisions

const DEPT_STATUS_COLORS: Record<string, string> = {
  vert: DSFR_HEX.text.default.success.default,
  orange: DSFR_HEX.text.default.warning.default,
  rouge: DSFR_HEX.text.default.error.default,
  gris: DSFR_HEX.text.default.grey.default,
}

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

function getBoundsFromGeometry(geometry: any): [[number, number], [number, number]] {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
  function processCoords(coords: any) {
    if (typeof coords[0] === 'number') {
      minLng = Math.min(minLng, coords[0])
      maxLng = Math.max(maxLng, coords[0])
      minLat = Math.min(minLat, coords[1])
      maxLat = Math.max(maxLat, coords[1])
    }
    else {
      coords.forEach(processCoords)
    }
  }
  processCoords(geometry.coordinates)
  return [[minLng, minLat], [maxLng, maxLat]]
}

function getCommuneCoordinates(commune: any): [number, number] | null {
  const lon = Number(commune?.lon)
  const lat = Number(commune?.lat)
  return Number.isFinite(lon) && Number.isFinite(lat) ? [lon, lat] : null
}

interface UseSuiviBanOptions {
  selectedTab: string
}

export function useSuiviBan({ selectedTab }: UseSuiviBanOptions) {
  const mapRef = useRef<MapRef>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [suiviBanGeoJSON, setSuiviBanGeoJSON] = useState<any>(null)
  const [suiviBanSelectedDept, setSuiviBanSelectedDept] = useState<SuiviBanSelectedDept | null>(null)
  const [suiviBanCommunesGeoJSON, setSuiviBanCommunesGeoJSON] = useState<any>(null)
  const [suiviBanLoadingCommunes, setSuiviBanLoadingCommunes] = useState(false)
  const [suiviBanSelectedCommune, setSuiviBanSelectedCommune] = useState<any>(null)
  const [suiviBanActiveStatuts, setSuiviBanActiveStatuts] = useState<string[]>(['rouge', 'orange', 'vert', 'gris'])
  const [suiviBanProducteurFilter, setSuiviBanProducteurFilter] = useState<string | null>(null)
  const [suiviBanProducteurs, setSuiviBanProducteurs] = useState<any[]>([])
  const [hoveredDept, setHoveredDept] = useState<HoveredDept | null>(null)
  const [hoveredCommune, setHoveredCommune] = useState<HoveredCommune | null>(null)
  const deptsGeometryRef = useRef<any>(null)

  useEffect(() => {
    if (selectedTab !== 'suivi-ban' || suiviBanProducteurs.length > 0) return
    fetch(`${SUIVI_BAN_API}/producteurs`)
      .then(r => r.json())
      .then(data => setSuiviBanProducteurs(data || []))
      .catch(e => console.error('Producteurs load error:', e))
  }, [selectedTab, suiviBanProducteurs.length])

  useEffect(() => {
    if (selectedTab !== 'suivi-ban' || suiviBanSelectedDept) return
    async function loadDepts() {
      try {
        if (!deptsGeometryRef.current) {
          const res = await fetch(`${SUIVI_BAN_API}/departements`)
          deptsGeometryRef.current = await res.json()
        }
        const depts = deptsGeometryRef.current
        const statsUrl = suiviBanProducteurFilter
          ? `${SUIVI_BAN_API}/producteur/${encodeURIComponent(suiviBanProducteurFilter)}/departements`
          : `${SUIVI_BAN_API}/stats/departements`
        const stats = await fetch(statsUrl).then(r => r.json())
        const statusOrder = ['vert', 'orange', 'rouge', 'gris'] as const
        const geojson = {
          ...depts,
          features: (depts.features || []).map((f: any) => {
            const deptStats = stats[f.properties.code]
            let dominantColor: string = DSFR_HEX.background.alt.grey.default
            let dominantOpacity = 0.4
            if (deptStats && deptStats.total > 0) {
              const sorted = statusOrder
                .map(key => ({ key, value: deptStats[key] || 0 }))
                .sort((a, b) => b.value - a.value)
              const activeTotal = sorted.reduce((sum, s) => sum + s.value, 0)
              if (activeTotal > 0) {
                const dominant = sorted[0]
                dominantColor = DEPT_STATUS_COLORS[dominant.key] || DSFR_HEX.background.alt.grey.default
                dominantOpacity = 0.3 + (dominant.value / activeTotal) * 0.55
              }
            }
            return {
              ...f,
              properties: { ...f.properties, ...(deptStats || {}), dominant_color: dominantColor, dominant_opacity: dominantOpacity },
            }
          }),
        }
        setSuiviBanGeoJSON(geojson)
      }
      catch (e) {
        console.error('Suivi BAN depts error:', e)
      }
    }
    loadDepts()
  }, [selectedTab, suiviBanProducteurFilter, suiviBanSelectedDept])

  useEffect(() => {
    if (!suiviBanSelectedDept) return
    const controller = new AbortController()
    setSuiviBanCommunesGeoJSON(null)
    setSuiviBanLoadingCommunes(true)
    fetch(`${SUIVI_BAN_API}/departement/${suiviBanSelectedDept.code}/communes`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => setSuiviBanCommunesGeoJSON(data))
      .catch((e: Error) => {
        if (e.name !== 'AbortError') {
          console.error('Communes load error:', e)
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
    if (selectedTab !== 'suivi-ban' || suiviBanSelectedDept) {
      setHoveredDept(null)
      return
    }
    const map = mapRef.current?.getMap()
    if (!map) return

    const onMouseMove = (e: any) => {
      if (!map.getLayer('suivi-ban-dept-fill')) return
      const features = map.queryRenderedFeatures(e.point, { layers: ['suivi-ban-dept-fill'] })
      if (features.length > 0) {
        const p = features[0].properties as any
        const total = Number(p.total || 0)
        setHoveredDept({
          code: p.code,
          nom: p.nom || p.code,
          vert: Number(p.vert || 0),
          orange: Number(p.orange || 0),
          rouge: Number(p.rouge || 0),
          gris: Number(p.gris || 0),
          total,
          x: e.point.x,
          y: e.point.y,
        })
      }
      else {
        setHoveredDept(null)
      }
    }

    const onMouseLeave = () => setHoveredDept(null)

    map.on('mousemove', onMouseMove)
    map.on('mouseout', onMouseLeave)

    return () => {
      map.off('mousemove', onMouseMove)
      map.off('mouseout', onMouseLeave)
      setHoveredDept(null)
    }
  }, [selectedTab, suiviBanSelectedDept])

  useEffect(() => {
    if (selectedTab !== 'suivi-ban' || !suiviBanSelectedDept) {
      setHoveredCommune(null)
      return
    }
    const map = mapRef.current?.getMap()
    if (!map) return

    const onMouseMove = (e: any) => {
      if (!map.getLayer('suivi-ban-commune-fill')) return
      const features = map.queryRenderedFeatures(e.point, { layers: ['suivi-ban-commune-fill'] })
      if (features.length > 0) {
        const p = features[0].properties as any
        setHoveredCommune({
          code: p.code,
          nom: p.nom || p.code,
          statut: p.statut || 'gris',
          nb_numeros: Number(p.nb_numeros || 0),
          nb_voies: Number(p.nb_voies || 0),
          producteur: p.producteur,
          x: e.point.x,
          y: e.point.y,
        })
      }
      else {
        setHoveredCommune(null)
      }
    }

    const onMouseLeave = () => setHoveredCommune(null)

    map.on('mousemove', onMouseMove)
    map.on('mouseout', onMouseLeave)

    return () => {
      map.off('mousemove', onMouseMove)
      map.off('mouseout', onMouseLeave)
      setHoveredCommune(null)
    }
  }, [selectedTab, suiviBanSelectedDept])

  const handleMapClick = useCallback((e: any) => {
    if (selectedTab !== 'suivi-ban') return
    const features = e.features || []

    const communeFeature = features.find((f: any) => f.layer?.id === 'suivi-ban-commune-fill')
    if (communeFeature?.properties) {
      setSuiviBanSelectedCommune(communeFeature.properties)
      return
    }

    const deptFeature = features.find((f: any) => f.layer?.id === 'suivi-ban-dept-fill')
    if (deptFeature?.geometry?.coordinates) {
      const { code, nom } = deptFeature.properties
      const isNewDept = !suiviBanSelectedDept || suiviBanSelectedDept.code !== code
      if (isNewDept) {
        setSuiviBanSelectedDept({ code, nom })
        setSuiviBanSelectedCommune(null)
        const bounds = getBoundsFromGeometry(deptFeature.geometry)
        mapRef.current?.fitBounds(bounds, { padding: 40, duration: 800 })
      }
      return
    }

    if (suiviBanSelectedDept) {
      setSuiviBanSelectedCommune(null)
      return
    }
  }, [selectedTab, suiviBanSelectedDept, mapRef])

  const handleCommuneClick = useCallback((commune: any) => {
    setSuiviBanSelectedCommune(commune)
    const coordinates = getCommuneCoordinates(commune)
    if (coordinates) {
      mapRef.current?.flyTo({ center: coordinates, zoom: 13, duration: 600 })
    }
  }, [mapRef])

  const handleSearchSelect = useCallback((commune: any) => {
    if (commune.dept && commune.dept_nom) {
      setSuiviBanSelectedDept({ code: commune.dept, nom: commune.dept_nom })
      setSuiviBanCommunesGeoJSON(null)
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
    mapRef.current?.flyTo({ center: [territoire.lon, territoire.lat], zoom: territoire.zoom, duration: 1000 })
    setSuiviBanSelectedDept({ code, nom: territoire.nom })
    setSuiviBanCommunesGeoJSON(null)
    setSuiviBanSelectedCommune(null)
  }, [mapRef])

  const handleBack = useCallback(() => {
    setSuiviBanSelectedDept(null)
    setSuiviBanCommunesGeoJSON(null)
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
    const visibility = selectedTab === 'suivi-ban' ? 'none' : 'visible'
    const apply = () => {
      if (map.getLayer('bal-polygon-fill')) {
        map.setLayoutProperty('bal-polygon-fill', 'visibility', visibility)
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
    suiviBanGeoJSON,
    suiviBanSelectedDept,
    suiviBanCommunesGeoJSON,
    suiviBanLoadingCommunes,
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
    handleBack,
    hoveredDept,
    hoveredCommune,
  }
}

export type SuiviBanContext = ReturnType<typeof useSuiviBan>
