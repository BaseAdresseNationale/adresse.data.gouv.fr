'use client'

import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { fr } from '@codegouvfr/react-dsfr'
import { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'
const SUIVI_BAN_API = process.env.NEXT_PUBLIC_SUIVI_BAN_API_URL || 'https://suivi-ban.mut-dev.ign.fr/api'

const DSFR = fr.colors.decisions
const DSFR_HEX = fr.colors.getHex({ isDark: false }).decisions
const GREY_ICON_STROKE_URL = encodeURIComponent(DSFR_HEX.text.mention.grey.default)
const GREY_ICON_FILL_URL = encodeURIComponent(DSFR_HEX.text.default.grey.default)

const STATUS_COLORS: Record<string, string> = {
  vert: DSFR_HEX.text.default.success.default,
  orange: DSFR_HEX.text.default.warning.default,
  rouge: DSFR_HEX.text.default.error.default,
  gris: DSFR_HEX.text.default.grey.default,
}

const STATUS_TEXT_COLORS: Record<string, string> = {
  vert: DSFR_HEX.text.default.success.default,
  orange: DSFR_HEX.text.default.warning.default,
  rouge: DSFR_HEX.text.default.error.default,
  gris: DSFR_HEX.text.default.grey.default,
}

const STATUS_BG: Record<string, string> = {
  vert: DSFR_HEX.background.alt.greenBourgeon.default,
  orange: DSFR_HEX.background.alt.orangeTerreBattue.default,
  rouge: DSFR_HEX.background.alt.redMarianne.default,
  gris: DSFR_HEX.background.alt.grey.default,
}

const STATUS_LABELS: Record<string, string> = {
  vert: 'ID fiabilisés',
  orange: 'ID initiés à contrôler',
  rouge: 'ID non initiés',
  gris: 'Sans donnée',
}

const STATUS_LABELS_SHORT: Record<string, string> = {
  vert: 'Fiabilisés',
  orange: 'À contrôler',
  rouge: 'Non initiés',
  gris: 'Sans donnée',
}

const STATUS_ORDER = ['rouge', 'orange', 'vert', 'gris']

interface SuiviBanStats {
  total: number
  vert: number
  orange: number
  rouge: number
  gris: number
  numeros: number
  voies: number
}

interface Producteur {
  nom: string
  nb_communes: number
  nb_depts: number
  vert: number
  orange: number
  rouge: number
}

interface TabSuiviBanProps {
  filter: DeploiementBALSearchResult | null
  deptFilter: { code: string, nom: string } | null
  onCommuneClick: (commune: any) => void
  onSearchSelect?: (commune: any) => void
  activeStatuts?: string[]
  onActiveStatutsChange?: (statuts: string[]) => void
  producteurFilter?: string | null
  onProducteurFilterChange?: (p: string | null) => void
  allProducteurs?: Producteur[]
  inPanel?: boolean
}

const StyledWrapper = styled.div<{ $inPanel?: boolean }>`
  margin-bottom: ${({ $inPanel }) => $inPanel ? '0' : '2rem'};
  padding: ${({ $inPanel }) => $inPanel ? '14px' : '0'};

  .global-search-wrapper {
    position: relative;
    margin-bottom: 0.75rem;
  }

  .status-legend-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
  }

  .status-legend-dialog {
    background: var(--background-default-grey);
    border-radius: 10px;
    padding: 16px 18px;
    max-width: 420px;
    box-shadow: var(--overlap-shadow);
    font-size: 0.85rem;
  }

  .status-legend-title {
    font-weight: 700;
    margin-bottom: 10px;
    font-size: 0.9rem;
  }

  .status-legend-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .status-legend-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .status-legend-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 4px;
  }

  .global-search-input {
    width: 100%;
    padding: 9px 12px 9px 36px;
    border: 2px solid var(--border-default-grey);
    border-radius: 8px;
    font-size: 0.85rem;
    background: var(--background-default-grey) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${GREY_ICON_STROKE_URL}' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 10px center;
    transition: border-color 0.15s;
    box-sizing: border-box;

    &:focus {
      outline: none;
      border-color: var(--border-active-blue-france);
      box-shadow: 0 0 0 2px var(--background-contrast-blue-france);
    }
  }

  .global-search-results {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    background: var(--background-default-grey);
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;
    box-shadow: var(--overlap-shadow);
    z-index: 200;
    max-height: 260px;
    overflow-y: auto;
  }

  .search-result-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    width: 100%;
    background: none;
    border: none;
    border-bottom: 1px solid var(--border-default-grey);
    cursor: pointer;
    text-align: left;
    transition: background 0.1s;

    &:last-child { border-bottom: none; }
    &:hover { background: var(--background-contrast-grey-hover); }
  }

  .search-result-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .search-result-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .search-result-nom {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-title-grey);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .search-result-meta {
    font-size: 0.72rem;
    color: var(--text-mention-grey);
  }

  .search-result-loading,
  .search-result-empty {
    padding: 10px 14px;
    font-size: 0.82rem;
    color: var(--text-mention-grey);
    text-align: center;
  }

  .stat-cards {
    display: grid;
    gap: ${({ $inPanel }) => $inPanel ? '0.5rem' : '1rem'};
    margin-bottom: ${({ $inPanel }) => $inPanel ? '0.75rem' : '1.5rem'};

    &.cards-4 { grid-template-columns: ${({ $inPanel }) => $inPanel ? '1fr 1fr' : 'repeat(4, 1fr)'}; }
    &.cards-3 { grid-template-columns: ${({ $inPanel }) => $inPanel ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)'}; }
  }

  .stat-card {
    background: var(--background-default-grey);
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;
    border-top-width: 3px;
    padding: ${({ $inPanel }) => $inPanel ? '0.7rem 0.75rem' : '1.25rem 1rem'};
    text-align: left;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .stat-card-value {
    font-size: ${({ $inPanel }) => $inPanel ? '1.25rem' : '1.75rem'};
    font-weight: 700;
    display: block;
    line-height: 1.2;
    white-space: nowrap;
  }

  .stat-card-label {
    font-size: 0.68rem;
    color: var(--text-default-grey);
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-top: 0.25rem;
    line-height: 1.3;
  }

  .section-title {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-default-grey);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 0.5rem;
  }

  .status-section {
    margin-bottom: ${({ $inPanel }) => $inPanel ? '0.75rem' : '1.5rem'};
  }

  .status-bar {
    display: flex;
    height: 6px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
    background: var(--background-contrast-grey);
  }

  .status-bar-segment {
    transition: width 0.3s ease;
  }

  .status-rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    border-radius: 6px;
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;
    cursor: default;
    transition: opacity 0.15s, background 0.15s;

    &.clickable {
      cursor: pointer;
      &:hover { background: var(--background-contrast-grey-hover); }
      &.inactive { opacity: 0.3; }
    }

    .row-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .row-label {
      flex: 1;
      font-size: 0.8rem;
      color: var(--text-default-grey);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .row-count {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-title-grey);
      white-space: nowrap;
      min-width: 42px;
      text-align: right;
    }

    .row-pct {
      font-size: 0.75rem;
      color: var(--text-mention-grey);
      white-space: nowrap;
      min-width: 38px;
      text-align: right;
    }

    .row-check {
      font-size: 0.65rem;
      color: var(--text-action-high-blue-france);
      flex-shrink: 0;
      opacity: 0;
      width: 10px;
      &.on { opacity: 1; }
    }
  }

  .status-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 10px 4px 8px;
    border-left: 3px solid transparent;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: sticky;
    top: 0;
    z-index: 1;

    .group-count-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 8px;
      opacity: 0.85;
    }
  }

  .commune-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .filters-row {
    display: flex;
    gap: 6px;
    margin-bottom: 0.6rem;

    .commune-search {
      flex: 1;
      min-width: 0;
      padding: 7px 10px 7px 30px;
      border: 1.5px solid var(--border-default-grey);
      border-radius: 8px;
      font-size: 0.82rem;
      color: var(--text-default-grey);
      background: var(--background-default-grey) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='${GREY_ICON_STROKE_URL}' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 9px center;

      &::placeholder {
        color: var(--text-mention-grey);
      }

      &:focus { outline: none; border-color: var(--border-active-blue-france); box-shadow: 0 0 0 2px var(--background-contrast-blue-france); }
    }

    .producteur-select {
      flex: 0 0 auto;
      max-width: 145px;
      min-width: 100px;
      padding: 6px 28px 6px 8px;
      border: 1.5px solid var(--border-default-grey);
      border-radius: 8px;
      font-size: 0.75rem;
      background-color: var(--background-default-grey);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${GREY_ICON_FILL_URL}' d='M6 9 1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      background-size: 12px 12px;
      color: var(--text-default-grey);
      cursor: pointer;
      text-overflow: ellipsis;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;

      &:focus { outline: none; border-color: var(--border-active-blue-france); }
      &.active { border-color: var(--border-active-blue-france); background-color: var(--background-alt-blue-france); color: var(--text-action-high-blue-france); font-weight: 600; }
    }
  }

  .producteur-select {
    padding: 7px 30px 7px 10px;
    border: 1.5px solid var(--border-default-grey);
    border-radius: 8px;
    font-size: 0.82rem;
    background-color: var(--background-default-grey);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${GREY_ICON_FILL_URL}' d='M6 9 1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px 12px;
    color: var(--text-default-grey);
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    &:focus { outline: none; border-color: var(--border-active-blue-france); }
    &.active { border-color: var(--border-active-blue-france); background-color: var(--background-alt-blue-france); color: var(--text-action-high-blue-france); font-weight: 600; }
  }

  .commune-search {
    width: 100%;
    padding: 7px 10px 7px 32px;
    border: 1.5px solid var(--border-default-grey);
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 0.6rem;
    background: var(--background-default-grey) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='${GREY_ICON_STROKE_URL}' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 10px center;
    box-sizing: border-box;
    color: var(--text-default-grey);

    &::placeholder {
      color: var(--text-mention-grey);
    }

    &:focus {
      outline: none;
      border-color: var(--border-active-blue-france);
      box-shadow: 0 0 0 2px var(--background-contrast-blue-france);
    }
  }

  .commune-list {
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;
    overflow: hidden;
  }

  .commune-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    cursor: pointer;
    border-bottom: 1px solid var(--border-default-grey);
    border-left: 4px solid transparent;
    transition: background 0.1s;

    &:last-child { border-bottom: none; }
    &:hover { background: var(--background-alt-blue-france-hover); }

    .commune-main {
      flex: 1;
      min-width: 0;
    }

    .commune-name {
      display: block;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-title-grey);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .commune-producteur {
      display: block;
      font-size: 0.65rem;
      color: var(--text-mention-grey);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 1px;
    }

    .commune-code {
      font-size: 0.7rem;
      color: var(--text-mention-grey);
      flex-shrink: 0;
    }

    .commune-numeros {
      font-size: 0.7rem;
      color: var(--text-default-grey);
      white-space: nowrap;
      flex-shrink: 0;
      background: var(--background-contrast-grey);
      padding: 1px 5px;
      border-radius: 4px;
    }
  }

  .source-link {
    margin-top: 1.5rem;
    font-size: 0.8rem;
    color: var(--text-default-grey);

    a { color: var(--text-action-high-blue-france); }
  }

  .loading, .error {
    padding: 2rem 0;
    color: var(--text-default-grey);
    font-size: 0.9rem;
  }
`

function pct(value: number, total: number): number {
  if (!total) return 0
  return Math.round((value / total) * 1000) / 10
}

export default function TabSuiviBAN({ filter, deptFilter, onCommuneClick, onSearchSelect, activeStatuts: activeStatutsProp, onActiveStatutsChange, producteurFilter: producteurFilterProp, onProducteurFilterChange, allProducteurs = [], inPanel }: TabSuiviBanProps) {
  const [stats, setStats] = useState<SuiviBanStats | null>(null)
  const [communes, setCommunes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeStatutsLocal, setActiveStatutsLocal] = useState<string[]>(['rouge', 'orange', 'vert', 'gris'])
  const [communeSearch, setCommuneSearch] = useState('')
  const [producteurFilterLocal, setProducteurFilterLocal] = useState<string | null>(null)
  const [globalSearch, setGlobalSearch] = useState('')
  const [globalSearchResults, setGlobalSearchResults] = useState<any[]>([])
  const [showStatusLegend, setShowStatusLegend] = useState(false)
  const [globalSearchLoading, setGlobalSearchLoading] = useState(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const producteurFilter = producteurFilterProp !== undefined ? producteurFilterProp : producteurFilterLocal
  const setProducteurFilter = (p: string | null) => {
    if (onProducteurFilterChange) onProducteurFilterChange(p)
    else setProducteurFilterLocal(p)
  }

  const activeStatuts = activeStatutsProp ?? activeStatutsLocal
  const onChangeRef = useRef(onActiveStatutsChange)
  onChangeRef.current = onActiveStatutsChange

  const setActiveStatuts = (next: string[] | ((prev: string[]) => string[])) => {
    const resolved = typeof next === 'function' ? next(activeStatuts) : next
    if (onChangeRef.current) onChangeRef.current(resolved)
    else setActiveStatutsLocal(resolved)
  }

  const activeDeptCode = deptFilter?.code ?? (filter?.type === 'Département' ? filter.code : null)

  useEffect(() => {
    setCommuneSearch('')
    setActiveStatutsLocal(['rouge', 'orange', 'vert', 'gris'])
    if (onChangeRef.current) onChangeRef.current(['rouge', 'orange', 'vert', 'gris'])

    if (!activeDeptCode) {
      setCommunes([])
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(false)

    fetch(`${SUIVI_BAN_API}/departement/${activeDeptCode}/communes`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('API error')
        return r.json()
      })
      .then((data) => {
        if (controller.signal.aborted) return
        const features: any[] = data?.features || []
        const counts: SuiviBanStats = { total: features.length, vert: 0, orange: 0, rouge: 0, gris: 0, numeros: 0, voies: 0 }
        features.forEach((f: any) => {
          const s = (f.properties?.statut || 'gris') as keyof SuiviBanStats
          if (s in counts) (counts[s] as number)++
          counts.numeros += f.properties?.nb_numeros || 0
          counts.voies += f.properties?.nb_voies || 0
        })
        setStats(counts)
        setCommunes(features.map(f => f.properties).sort((a, b) =>
          STATUS_ORDER.indexOf(a.statut || 'gris') - STATUS_ORDER.indexOf(b.statut || 'gris')
        ))
      })
      .catch((e: Error) => {
        if (e.name !== 'AbortError') setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [activeDeptCode])

  useEffect(() => {
    if (activeDeptCode) return

    const controller = new AbortController()
    setLoading(true)
    setError(false)

    const url = producteurFilter
      ? `${SUIVI_BAN_API}/producteur/${encodeURIComponent(producteurFilter)}/stats`
      : `${SUIVI_BAN_API}/stats/global`

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error('API error')
        return r.json()
      })
      .then((data) => {
        if (!controller.signal.aborted) setStats(data)
      })
      .catch((e: Error) => {
        if (e.name !== 'AbortError') setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [activeDeptCode, producteurFilter])

  useEffect(() => {
    if (activeDeptCode) {
      setGlobalSearchResults([])
      return
    }
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    if (!globalSearch || globalSearch.length < 2) {
      setGlobalSearchResults([])
      return
    }

    searchDebounceRef.current = setTimeout(() => {
      setGlobalSearchLoading(true)
      fetch(`${SUIVI_BAN_API}/search?q=${encodeURIComponent(globalSearch)}`)
        .then(r => r.json())
        .then(data => setGlobalSearchResults(Array.isArray(data) ? data : []))
        .catch(() => setGlobalSearchResults([]))
        .finally(() => setGlobalSearchLoading(false))
    }, 300)

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    }
  }, [globalSearch, activeDeptCode])

  const toggleStatut = (s: string) => {
    setActiveStatuts(prev =>
      prev.includes(s) ? (prev.length > 1 ? prev.filter(x => x !== s) : prev) : [...prev, s]
    )
  }

  if (loading) return <StyledWrapper $inPanel={inPanel}><p className="loading">Chargement…</p></StyledWrapper>
  if (error || !stats) return <StyledWrapper $inPanel={inPanel}><p className="error">Erreur de chargement.</p></StyledWrapper>

  const statuses = ['vert', 'orange', 'rouge', 'gris'] as const

  const uniqueProducteurs = [...new Set(communes.filter(c => c.producteur).map(c => c.producteur as string))].sort()

  const filteredCommunes = communes.filter((c) => {
    const statut = c.statut || 'gris'
    if (!activeStatuts.includes(statut)) return false
    if (producteurFilter && c.producteur !== producteurFilter) return false
    if (communeSearch) {
      const query = communeSearch.trim().toLowerCase()
      const nom = (c.nom || '').toLowerCase()
      const codeInsee = String(c.code || '').toLowerCase()
      if (!nom.includes(query) && !codeInsee.includes(query)) return false
    }
    return true
  })

  const displayStats = (() => {
    if (activeDeptCode && producteurFilter) {
      const base = communes.filter(c => c.producteur === producteurFilter)
      return {
        total: base.length,
        vert: base.filter(c => c.statut === 'vert').length,
        orange: base.filter(c => c.statut === 'orange').length,
        rouge: base.filter(c => c.statut === 'rouge').length,
        gris: base.filter(c => (c.statut || 'gris') === 'gris').length,
        numeros: base.reduce((sum, c) => sum + (c.nb_numeros || 0), 0),
        voies: base.reduce((sum, c) => sum + (c.nb_voies || 0), 0),
      }
    }
    if (!activeDeptCode && producteurFilter) {
      const entry = allProducteurs.find(p => p.nom === producteurFilter)
      if (entry) {
        const v = entry.vert || 0
        const o = entry.orange || 0
        const r = entry.rouge || 0
        const t = entry.nb_communes || 0
        return {
          total: t,
          vert: v,
          orange: o,
          rouge: r,
          gris: Math.max(0, t - v - o - r),
          numeros: stats?.numeros || 0,
          voies: stats?.voies || 0,
        }
      }
    }
    return stats
  })()

  const total = displayStats.total || 1
  const statusesToShow = statuses.filter(s => s !== 'gris' || (displayStats?.gris ?? 0) > 0)

  const fmt = (n: number) => (n || 0).toLocaleString('fr-FR')
  const STAT_CARDS = activeDeptCode
    ? [
        { value: fmt(displayStats.total), label: 'Communes', accent: DSFR.text.actionHigh.blueFrance.default, valueColor: DSFR.text.actionHigh.blueFrance.default },
        { value: fmt(displayStats.numeros), label: 'Numéros', accent: DSFR.text.actionHigh.blueCumulus.default, valueColor: DSFR.text.actionHigh.blueCumulus.default },
        { value: fmt(displayStats.voies), label: 'Voies', accent: DSFR.text.actionHigh.greenArchipel.default, valueColor: DSFR.text.actionHigh.greenArchipel.default },
      ]
    : [
        { value: fmt(displayStats.total), label: 'Communes', accent: DSFR.text.actionHigh.blueFrance.default, valueColor: DSFR.text.actionHigh.blueFrance.default },
        { value: `${pct(displayStats.vert, total)}%`, label: 'Fiabilisés', accent: STATUS_TEXT_COLORS.vert, valueColor: STATUS_TEXT_COLORS.vert },
        { value: fmt(displayStats.numeros), label: 'Numéros', accent: DSFR.text.actionHigh.blueCumulus.default, valueColor: DSFR.text.actionHigh.blueCumulus.default },
        { value: fmt(displayStats.voies), label: 'Voies', accent: DSFR.text.actionHigh.greenArchipel.default, valueColor: DSFR.text.actionHigh.greenArchipel.default },
      ]

  return (
    <StyledWrapper $inPanel={inPanel}>

      {!activeDeptCode && (
        <div className="global-search-wrapper">
          <input
            type="text"
            className="global-search-input"
            placeholder="Nom ou code INSEE"
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            autoComplete="off"
          />
          {globalSearchLoading && (
            <div className="global-search-results">
              <div className="search-result-loading">Recherche…</div>
            </div>
          )}
          {!globalSearchLoading && globalSearchResults.length > 0 && (
            <div className="global-search-results">
              {globalSearchResults.map(r => (
                <button
                  key={r.code}
                  type="button"
                  className="search-result-item"
                  onClick={async () => {
                    setGlobalSearch('')
                    setGlobalSearchResults([])
                    try {
                      const res = await fetch(`${SUIVI_BAN_API}/commune/${r.code}`)
                      const full = res.ok ? await res.json() : null
                      const commune = full ?? r
                      if (onSearchSelect) onSearchSelect(commune)
                      else onCommuneClick(commune)
                    }
                    catch {
                      if (onSearchSelect) onSearchSelect(r)
                      else onCommuneClick(r)
                    }
                  }}
                >
                  <span
                    className="search-result-dot"
                    style={{ background: STATUS_COLORS[r.statut] || STATUS_COLORS.gris }}
                  />
                  <span className="search-result-info">
                    <span className="search-result-nom">{r.nom}</span>
                    <span className="search-result-meta">{r.dept_nom} ({r.dept})</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {!globalSearchLoading && globalSearch.length >= 2 && globalSearchResults.length === 0 && (
            <div className="global-search-results">
              <div className="search-result-empty">Aucune commune trouvée</div>
            </div>
          )}
        </div>
      )}

      <div className={`stat-cards ${STAT_CARDS.length === 3 ? 'cards-3' : 'cards-4'}`}>
        {STAT_CARDS.map(card => (
          <div key={card.label} className="stat-card" style={{ borderTopColor: card.accent }}>
            <span className="stat-card-value" style={{ color: card.valueColor }}>{card.value}</span>
            <div className="stat-card-label">{card.label}</div>
          </div>
        ))}
      </div>

      {!activeDeptCode && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div className="section-title" style={{ marginBottom: '0.35rem' }}>Mandataire</div>
          <select
            className={`producteur-select ${producteurFilter ? 'active' : ''}`}
            style={{ maxWidth: '100%', width: '100%' }}
            value={producteurFilter || ''}
            disabled={allProducteurs.length === 0}
            onChange={e => setProducteurFilter(e.target.value || null)}
          >
            <option value="">
              {allProducteurs.length === 0 ? 'Chargement…' : 'Tous les mandataires'}
            </option>
            {allProducteurs.map(p => (
              <option key={p.nom} value={p.nom}>
                {p.nom} ({p.nb_communes} communes)
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="status-section">
        <div className="status-bar">
          {statusesToShow.map(s => (
            <div
              key={s}
              className="status-bar-segment"
              style={{ width: `${pct(displayStats[s] ?? 0, total)}%`, background: STATUS_COLORS[s] }}
            />
          ))}
        </div>
        <div className="status-rows">
          {statusesToShow.map((s) => {
            const isActive = activeStatuts.includes(s)
            const isFiltering = activeStatuts.length < 4
            const p = pct(displayStats[s] ?? 0, total)
            if (activeDeptCode) {
              return (
                <button
                  key={s}
                  type="button"
                  className={`status-row clickable ${isActive ? '' : 'inactive'}`}
                  onClick={() => toggleStatut(s)}
                >
                  <span className="row-dot" style={{ background: STATUS_COLORS[s] }} />
                  <span className="row-label">{STATUS_LABELS[s]}</span>
                  <span className="row-count">{fmt(displayStats[s] ?? 0)}</span>
                  <span className="row-pct">{p}%</span>
                  {isFiltering && <span className={`row-check ${isActive ? 'on' : ''}`}>✓</span>}
                </button>
              )
            }
            return (
              <div key={s} className="status-row">
                <span className="row-dot" style={{ background: STATUS_COLORS[s] }} />
                <span className="row-label">{STATUS_LABELS[s]}</span>
                <span className="row-count">{fmt(displayStats[s] ?? 0)}</span>
                <span className="row-pct">{p}%</span>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={() => setShowStatusLegend(true)}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '0.8rem',
            color: 'var(--text-default-grey)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: '1px solid var(--border-default-grey)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            i
          </span>
          <span>Comprendre les statuts</span>
        </button>
      </div>

      {showStatusLegend && (
        <div className="status-legend-overlay" onClick={() => setShowStatusLegend(false)}>
          <div
            className="status-legend-dialog"
            onClick={e => e.stopPropagation()}
          >
            <div className="status-legend-title">Légende des statuts</div>
            <div className="status-legend-content">
              <div className="status-legend-row">
                <span className="status-legend-dot" style={{ background: STATUS_COLORS.vert }} />
                <span>
                  <strong style={{ color: STATUS_TEXT_COLORS.vert }}>ID fiabilisés</strong> : les identifiants ont passé les contrôles d&apos;intégrité BAN, l&apos;historique est capitalisé sur ces données.
                </span>
              </div>
              <div className="status-legend-row">
                <span className="status-legend-dot" style={{ background: STATUS_COLORS.orange }} />
                <span>
                  <strong style={{ color: STATUS_TEXT_COLORS.orange }}>ID initiés à contrôler</strong> : les identifiants sont générés dans les BAL mais n&apos;ont pas encore intégré le dispositif de suivi de l&apos;historique.
                </span>
              </div>
              <div className="status-legend-row">
                <span className="status-legend-dot" style={{ background: STATUS_COLORS.rouge }} />
                <span>
                  <strong style={{ color: STATUS_TEXT_COLORS.rouge }}>ID non initiés</strong> : les identifiants n&apos;ont pas encore été générés dans la BAL.
                </span>
              </div>
            </div>
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button
                type="button"
                onClick={() => setShowStatusLegend(false)}
                style={{
                  border: 'none',
                  background: 'var(--background-action-low-blue-france)',
                  color: 'var(--text-action-high-blue-france)',
                  padding: '6px 10px',
                  borderRadius: 999,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDeptCode && !loading && communes.length > 0 && (
        <>
          {filteredCommunes.length < communes.length && (
            <div className="commune-list-header">
              <p className="section-title" style={{ margin: 0 }}>
                {filteredCommunes.length} / {communes.length} communes
              </p>
            </div>
          )}

          <div className="filters-row">
            <input
              type="text"
              className="commune-search"
              placeholder="Nom ou code INSEE"
              value={communeSearch}
              onChange={e => setCommuneSearch(e.target.value)}
            />
            {uniqueProducteurs.length > 0 && (
              <select
                className={`producteur-select ${producteurFilter ? 'active' : ''}`}
                value={producteurFilter || ''}
                onChange={e => setProducteurFilter(e.target.value || null)}
              >
                <option value="">Tous les mandataires</option>
                {uniqueProducteurs.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            )}
          </div>

          <div className="commune-list">
            {filteredCommunes.length === 0
              ? (
                  <div style={{ padding: '1.5rem 1rem', color: 'var(--text-mention-grey)', textAlign: 'center', fontSize: '0.85rem' }}>
                    Aucune commune pour ce filtre
                  </div>
                )
              : (() => {
                  const grouped = STATUS_ORDER
                    .map(s => ({ statut: s, items: filteredCommunes.filter(c => (c.statut || 'gris') === s) }))
                    .filter(g => g.items.length > 0)
                  return grouped.map(group => (
                    <div key={group.statut}>
                      <div
                        className="status-group-header"
                        style={{
                          background: STATUS_BG[group.statut],
                          borderLeftColor: STATUS_TEXT_COLORS[group.statut],
                          color: STATUS_TEXT_COLORS[group.statut],
                        }}
                      >
                        <span>{inPanel ? STATUS_LABELS_SHORT[group.statut] : STATUS_LABELS[group.statut]}</span>
                        <span
                          className="group-count-badge"
                          style={{ background: STATUS_TEXT_COLORS[group.statut], color: 'var(--text-inverted-grey)' }}
                        >
                          {group.items.length}
                        </span>
                      </div>
                      {group.items.map((c) => {
                        const color = STATUS_COLORS[c.statut] || STATUS_COLORS.gris
                        return (
                          <div
                            key={c.code}
                            className="commune-row"
                            style={{ borderLeftColor: color }}
                            onClick={() => onCommuneClick(c)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => e.key === 'Enter' && onCommuneClick(c)}
                          >
                            <span className="commune-main">
                              <span className="commune-name">{c.nom}</span>
                              {c.producteur && (
                                <span className="commune-producteur">{c.producteur}</span>
                              )}
                            </span>
                            <span className="commune-code">{c.code}</span>
                            <span className="commune-numeros">{(c.nb_numeros || 0).toLocaleString('fr-FR')} num.</span>
                          </div>
                        )
                      })}
                    </div>
                  ))
                })()}
          </div>
        </>
      )}

      {filter?.type === 'EPCI' && !deptFilter && (
        <p className="source-link" style={{ marginTop: '1rem', color: 'var(--text-default-warning)' }}>
          ⚠️ Le filtre EPCI n&apos;est pas supporté par le Suivi BAN. Cliquez sur un département sur la carte ou sélectionnez un département.
        </p>
      )}

      {!activeDeptCode && (
        <p className="source-link" style={{ marginTop: '1rem' }}>
          Cliquez sur un département pour voir le détail.
        </p>
      )}
    </StyledWrapper>
  )
}
