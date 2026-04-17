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

export function SuiviBanMapLayers({ suivi }: { suivi: SuiviBanContext }) {
  const {
    suiviBanGeoJSON,
    suiviBanSelectedDept,
    suiviBanCommunesGeoJSON,
    suiviBanActiveStatuts,
    suiviBanProducteurFilter,
  } = suivi
  return (
    <>
      {suiviBanGeoJSON && !suiviBanSelectedDept && (
        <Source id="suivi-ban-depts" type="geojson" data={suiviBanGeoJSON}>
          <Layer
            id="suivi-ban-dept-fill"
            type="fill"
            source="suivi-ban-depts"
            paint={{
              'fill-color': ['coalesce', ['get', 'dominant_color'], DSFR_HEX.background.flat.grey.default],
              'fill-opacity': ['coalesce', ['get', 'dominant_opacity'], 0.4],
            }}
          />
          <Layer
            id="suivi-ban-dept-outline"
            type="line"
            source="suivi-ban-depts"
            paint={{
              'line-color': DSFR_HEX.background.default.grey.default,
              'line-width': 0.8,
            }}
          />
          <Layer
            id="suivi-ban-dept-hover-outline"
            type="line"
            source="suivi-ban-depts"
            filter={suivi.hoveredDept
              ? ['==', ['get', 'code'], suivi.hoveredDept.code]
              : ['literal', false]}
            paint={{
              'line-color': DSFR_HEX.text.actionHigh.blueFrance.default,
              'line-width': 3,
            }}
          />
        </Source>
      )}

      {suiviBanSelectedDept && suiviBanCommunesGeoJSON && (
        <Source id="suivi-ban-communes" type="geojson" data={suiviBanCommunesGeoJSON}>
          <Layer
            id="suivi-ban-commune-fill"
            type="fill"
            source="suivi-ban-communes"
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
          <Layer
            id="suivi-ban-commune-hover-outline"
            type="line"
            source="suivi-ban-communes"
            filter={suivi.hoveredCommune
              ? ['==', ['get', 'code'], suivi.hoveredCommune.code]
              : ['literal', false]}
            paint={{
              'line-color': DSFR_HEX.text.actionHigh.blueFrance.default,
              'line-width': 3,
            }}
          />
        </Source>
      )}
    </>
  )
}
