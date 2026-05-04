'use client'

import { Layer, Source } from 'react-map-gl/maplibre'
import { fr } from '@codegouvfr/react-dsfr'
import { SuiviBanContext } from './useSuiviBan'

const DSFR_HEX = fr.colors.getHex({ isDark: false }).decisions

const STATUS_COLORS_MAP: Record<string, string> = {
  vert: DSFR_HEX.text.default.success.default,
  orange: DSFR_HEX.text.default.warning.default,
  rouge: DSFR_HEX.text.default.error.default,
  gris: DSFR_HEX.text.default.grey.default,
}

const SUIVI_BAN_API = process.env.NEXT_PUBLIC_SUIVI_BAN_API_URL || 'https://suivi-ban.mut-dev.ign.fr/api'

export function SuiviBanMapLayers({ suivi }: { suivi: SuiviBanContext }) {
  const {
    suiviBanDeptStats,
    suiviBanSelectedDept,
    suiviBanActiveStatuts,
    suiviBanProducteurFilter,
  } = suivi

  const deptColorExpression: any[] = ['match', ['get', 'code']]
  const deptOpacityExpression: any[] = ['match', ['get', 'code']]
  Object.entries(suiviBanDeptStats || {}).forEach(([code, stats]) => {
    const values = [
      { status: 'vert', count: Number(stats?.vert || 0) },
      { status: 'orange', count: Number(stats?.orange || 0) },
      { status: 'rouge', count: Number(stats?.rouge || 0) },
      { status: 'gris', count: Number(stats?.gris || 0) },
    ].sort((a, b) => b.count - a.count)

    const activeTotal = values.reduce((sum, item) => sum + item.count, 0)
    const dominantStatus = values[0]?.status || 'gris'
    const dominantCount = values[0]?.count || 0
    const color = STATUS_COLORS_MAP[dominantStatus] || DSFR_HEX.background.alt.grey.default
    const opacity = activeTotal > 0 ? 0.3 + (dominantCount / activeTotal) * 0.55 : 0.4

    deptColorExpression.push(code, color)
    deptOpacityExpression.push(code, opacity)
  })
  deptColorExpression.push(DSFR_HEX.background.alt.grey.default)
  deptOpacityExpression.push(0.4)

  return (
    <>
      {!suiviBanSelectedDept && (
        <Source
          id="suivi-ban-depts"
          type="vector"
          tiles={[`${SUIVI_BAN_API}/tiles/departements/{z}/{x}/{y}.pbf`]}
        >
          <Layer
            id="suivi-ban-dept-fill"
            type="fill"
            source="suivi-ban-depts"
            source-layer="departements"
            paint={{
              'fill-color': deptColorExpression as any,
              'fill-opacity': deptOpacityExpression as any,
            }}
          />
          <Layer
            id="suivi-ban-dept-outline"
            type="line"
            source="suivi-ban-depts"
            source-layer="departements"
            paint={{
              'line-color': DSFR_HEX.background.default.grey.default,
              'line-width': 0.8,
            }}
          />
        </Source>
      )}

      {suiviBanSelectedDept && (
        <Source
          id="suivi-ban-communes"
          type="vector"
          tiles={[`${SUIVI_BAN_API}/tiles/departement/${encodeURIComponent(suiviBanSelectedDept.code)}/{z}/{x}/{y}.pbf`]}
        >
          <Layer
            id="suivi-ban-commune-fill"
            type="fill"
            source="suivi-ban-communes"
            source-layer="communes"
            filter={['all',
              ['in', ['get', 'statut'], ['literal', suiviBanActiveStatuts]],
              suiviBanProducteurFilter
                ? ['==', ['get', 'producteur'], suiviBanProducteurFilter]
                : ['literal', true],
            ]}
            paint={{
              'fill-color': [
                'match',
                ['get', 'statut'],
                'vert', STATUS_COLORS_MAP.vert,
                'orange', STATUS_COLORS_MAP.orange,
                'rouge', STATUS_COLORS_MAP.rouge,
                STATUS_COLORS_MAP.gris,
              ],
              'fill-opacity': 0.75,
            }}
          />
          <Layer
            id="suivi-ban-commune-outline"
            type="line"
            source="suivi-ban-communes"
            source-layer="communes"
            filter={['all',
              ['in', ['get', 'statut'], ['literal', suiviBanActiveStatuts]],
              suiviBanProducteurFilter
                ? ['==', ['get', 'producteur'], suiviBanProducteurFilter]
                : ['literal', true],
            ]}
            paint={{
              'line-color': DSFR_HEX.background.default.grey.default,
              'line-width': 0.5,
            }}
          />
        </Source>
      )}
    </>
  )
}
