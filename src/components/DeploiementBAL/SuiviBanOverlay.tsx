'use client'

import { DeploiementBALSearchResult } from '@/hooks/useStatsDeploiement'
import TabSuiviBAN from './TabSuiviBAN'
import { SuiviBanContext, SuiviBanSelectedDept } from './useSuiviBan'
import { fr } from '@codegouvfr/react-dsfr'

const DSFR_HEX_OVERLAY = fr.colors.getHex({ isDark: false }).decisions

const COMMUNE_STATUT_LABELS: Record<string, string> = {
  vert: 'ID fiabilisés',
  orange: 'ID initiés à contrôler',
  rouge: 'ID non initiés',
  gris: 'Sans donnée',
}

const COMMUNE_STATUT_COLORS: Record<string, string> = {
  vert: DSFR_HEX_OVERLAY.text.default.success.default,
  orange: DSFR_HEX_OVERLAY.text.default.warning.default,
  rouge: DSFR_HEX_OVERLAY.text.default.error.default,
  gris: DSFR_HEX_OVERLAY.text.default.grey.default,
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 370,
  zIndex: 10,
  background: 'var(--background-default-grey)',
  boxShadow: 'var(--overlap-shadow)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const panelHeaderStyle: React.CSSProperties = {
  background: 'var(--background-action-high-blue-france)',
  padding: '12px 16px',
  color: 'var(--text-inverted-blue-france)',
  flexShrink: 0,
}

const panelBackBtnStyle: React.CSSProperties = {
  background: 'var(--background-contrast-blue-france)',
  border: 'none',
  color: 'var(--text-action-high-blue-france)',
  cursor: 'pointer',
  fontSize: 11,
  padding: '4px 10px',
  borderRadius: 4,
  fontWeight: 600,
}

const panelBodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  scrollbarColor: 'var(--border-default-grey) transparent',
}

interface PanelProps {
  filter: DeploiementBALSearchResult | null
  suivi: SuiviBanContext
}

function CommuneDetails({ commune }: { commune: any }) {
  const statut = commune?.statut || 'gris'
  const color = COMMUNE_STATUT_COLORS[statut] || DSFR_HEX_OVERLAY.text.default.grey.default
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'inline-block', background: `${color}22`, color, padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
        {COMMUNE_STATUT_LABELS[statut] || statut}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div style={{ textAlign: 'center', background: 'var(--background-contrast-grey)', borderRadius: 8, padding: '12px 6px' }}>
          <div style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.1 }}>{(commune?.nb_numeros || 0).toLocaleString('fr-FR')}</div>
          <div style={{ fontSize: 11, color: 'var(--text-default-grey)', marginTop: 2 }}>Numéros</div>
        </div>
        <div style={{ textAlign: 'center', background: 'var(--background-contrast-grey)', borderRadius: 8, padding: '12px 6px' }}>
          <div style={{ fontWeight: 800, fontSize: 22, lineHeight: 1.1 }}>{(commune?.nb_voies || 0).toLocaleString('fr-FR')}</div>
          <div style={{ fontSize: 11, color: 'var(--text-default-grey)', marginTop: 2 }}>Voies</div>
        </div>
      </div>

      {(commune?.producteur || commune?.type_composition) && (
        <div style={{ background: 'var(--background-contrast-grey)', borderRadius: 8, padding: 12, fontSize: 13 }}>
          {commune?.producteur && (
            <div style={{ marginBottom: commune?.type_composition ? 8 : 0 }}>
              <div style={{ fontSize: 11, color: 'var(--text-default-grey)' }}>Mandataire</div>
              <div style={{ fontWeight: 700 }}>{commune.producteur}</div>
            </div>
          )}
          {commune?.type_composition && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-default-grey)' }}>Composition</div>
              <div style={{ fontWeight: 700 }}>{commune.type_composition}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SuiviBanPanel({ filter, suivi }: PanelProps) {
  const dept: SuiviBanSelectedDept | null = suivi.suiviBanSelectedDept
  const commune = suivi.suiviBanSelectedCommune
  const isCommuneLevel = Boolean(dept && commune)
  return (
    <div style={panelStyle}>
      {dept && (
        <div style={panelHeaderStyle}>
          <>
            {!isCommuneLevel && (
              <button type="button" onClick={suivi.handleBack} style={panelBackBtnStyle}>
                ← France entière
              </button>
            )}
            {isCommuneLevel && (
              <button type="button" onClick={() => suivi.setSuiviBanSelectedCommune(null)} style={panelBackBtnStyle}>
                ← {dept.nom}
              </button>
            )}
            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 800, fontSize: 20, lineHeight: 1.15, letterSpacing: '-0.3px' }}>
                {isCommuneLevel ? (commune?.nom || 'Commune') : dept.nom}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 3, fontWeight: 500 }}>
                {isCommuneLevel && (
                  <>Commune {commune?.code || ''} · {dept.nom} ({dept.code})</>
                )}
                {!isCommuneLevel && (
                  <>
                    Département {dept.code}
                    {suivi.suiviBanLoadingCommunes ? ' · Chargement…' : ''}
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      )}
      <div style={panelBodyStyle}>
        {isCommuneLevel && <CommuneDetails commune={commune} />}
        {!isCommuneLevel && (
          <TabSuiviBAN
            filter={filter}
            deptFilter={dept}
            onCommuneClick={suivi.handleCommuneClick}
            onSearchSelect={suivi.handleSearchSelect}
            activeStatuts={suivi.suiviBanActiveStatuts}
            onActiveStatutsChange={suivi.setSuiviBanActiveStatuts}
            producteurFilter={suivi.suiviBanProducteurFilter}
            onProducteurFilterChange={suivi.setSuiviBanProducteurFilter}
            allProducteurs={suivi.suiviBanProducteurs}
            inPanel
          />
        )}
      </div>
    </div>
  )
}

const TERRITOIRES_OPTIONS = [
  { value: '971', label: '971 – Guadeloupe' },
  { value: '972', label: '972 – Martinique' },
  { value: '973', label: '973 – Guyane' },
  { value: '974', label: '974 – La Réunion' },
  { value: '976', label: '976 – Mayotte' },
  { value: '975', label: '975 – Saint-Pierre-et-Miquelon' },
  { value: '977', label: '977 – Saint-Barthélemy' },
  { value: '978', label: '978 – Saint-Martin' },
  { value: '988', label: '988 – Nouvelle-Calédonie' },
  { value: '987', label: '987 – Polynésie française' },
  { value: '986', label: '986 – Wallis-et-Futuna' },
]

interface SuiviBanOverlayProps {
  suivi: SuiviBanContext
  filter: DeploiementBALSearchResult | null
}

function DeptTooltip({ dept }: { dept: NonNullable<SuiviBanContext['hoveredDept']> }) {
  const total = dept.total
  const pct = (n: number) => total > 0 ? Math.round(n / total * 100) : 0
  return (
    <div
      style={{
        position: 'absolute',
        left: dept.x + 15,
        top: dept.y + 15,
        pointerEvents: 'none',
        background: 'var(--background-default-grey)',
        borderRadius: 8,
        boxShadow: 'var(--overlap-shadow)',
        padding: '10px 14px',
        fontSize: 13,
        zIndex: 20,
        minWidth: 200,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 14 }}>{dept.nom}</div>
      {total > 0 && (
        <>
          <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', border: `1px solid ${DSFR_HEX_OVERLAY.border.default.grey.default}`, marginBottom: 8 }}>
            <div style={{ width: `${pct(dept.vert)}%`, background: DSFR_HEX_OVERLAY.text.default.success.default }} />
            <div style={{ width: `${pct(dept.orange)}%`, background: DSFR_HEX_OVERLAY.text.default.warning.default }} />
            <div style={{ width: `${pct(dept.rouge)}%`, background: DSFR_HEX_OVERLAY.text.default.error.default }} />
            {dept.gris > 0 && <div style={{ width: `${pct(dept.gris)}%`, background: DSFR_HEX_OVERLAY.text.default.grey.default }} />}
          </div>
          <div style={{ fontSize: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span><span style={{ color: DSFR_HEX_OVERLAY.text.default.success.default }}>●</span> {pct(dept.vert)}%</span>
            <span><span style={{ color: DSFR_HEX_OVERLAY.text.default.warning.default }}>●</span> {pct(dept.orange)}%</span>
            <span><span style={{ color: DSFR_HEX_OVERLAY.text.default.error.default }}>●</span> {pct(dept.rouge)}%</span>
            {dept.gris > 0 && <span><span style={{ color: DSFR_HEX_OVERLAY.text.default.grey.default }}>●</span> {pct(dept.gris)}%</span>}
          </div>
        </>
      )}
      {total === 0 && (
        <div style={{ fontSize: 12, color: DSFR_HEX_OVERLAY.text.mention.grey.default, fontStyle: 'italic' }}>Aucune donnée</div>
      )}
    </div>
  )
}

function CommuneTooltip({ commune, deptNom }: { commune: NonNullable<SuiviBanContext['hoveredCommune']>, deptNom?: string }) {
  const statut = commune.statut || 'gris'
  const color = COMMUNE_STATUT_COLORS[statut] || DSFR_HEX_OVERLAY.text.default.grey.default
  return (
    <div
      style={{
        position: 'absolute',
        left: commune.x + 15,
        top: commune.y + 15,
        pointerEvents: 'none',
        background: 'var(--background-default-grey)',
        borderRadius: 8,
        boxShadow: 'var(--overlap-shadow)',
        padding: '10px 14px',
        fontSize: 13,
        zIndex: 20,
        minWidth: 200,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{commune.nom}</div>
      <div style={{ fontSize: 11, color: DSFR_HEX_OVERLAY.text.mention.grey.default, marginBottom: 8 }}>
        {commune.code}{deptNom ? ` · ${deptNom}` : ''}
      </div>
      <div style={{ display: 'inline-block', background: `${color}22`, color, padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
        {COMMUNE_STATUT_LABELS[statut] || statut}
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
        <span><strong>{(commune.nb_numeros || 0).toLocaleString('fr-FR')}</strong> numéros</span>
        <span><strong>{(commune.nb_voies || 0).toLocaleString('fr-FR')}</strong> voies</span>
      </div>
      {commune.producteur && (
        <div style={{ fontSize: 11, color: DSFR_HEX_OVERLAY.text.mention.grey.default, marginTop: 6 }}>Mandataire : {commune.producteur}</div>
      )}
    </div>
  )
}

export function SuiviBanOverlay({ suivi, filter }: SuiviBanOverlayProps) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      <div style={{ pointerEvents: 'auto' }}>
        <SuiviBanPanel suivi={suivi} filter={filter} />
      </div>

      {suivi.hoveredDept && !suivi.suiviBanSelectedDept && (
        <DeptTooltip dept={suivi.hoveredDept} />
      )}

      {suivi.hoveredCommune && suivi.suiviBanSelectedDept && (
        <CommuneTooltip commune={suivi.hoveredCommune} deptNom={suivi.suiviBanSelectedDept.nom} />
      )}

      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 50,
          pointerEvents: 'auto',
          background: 'var(--background-default-grey)',
          borderRadius: 8,
          boxShadow: 'var(--overlap-shadow)',
          overflow: 'hidden',
        }}
      >
        <select
          style={{
            border: 'none',
            padding: '9px 36px 9px 14px',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-default-grey)',
            background: 'var(--background-default-grey)',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(DSFR_HEX_OVERLAY.text.default.grey.default)}' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            outline: 'none',
            minWidth: 180,
          }}
          value=""
          onChange={(e) => {
            if (e.target.value) suivi.handleTerritorySelect(e.target.value)
            e.target.value = ''
          }}
        >
          <option value="">Naviguer vers…</option>
          <optgroup label="DOM-TOM">
            {TERRITOIRES_OPTIONS.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </optgroup>
        </select>
      </div>

    </div>
  )
}
