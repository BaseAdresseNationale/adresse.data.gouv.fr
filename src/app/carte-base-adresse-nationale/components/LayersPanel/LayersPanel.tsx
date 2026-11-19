import { useId } from 'react'
import Image from 'next/image'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

import {
  PanelSection,
  PanelHeader,
  PanelTitle,
  PanelContent,
  LayerFieldset,
  LayerLegend,
  LayerGrid,
  LayerOption,
  LayerThumbnail,
  LayerHint,
  LayerInfoIcon,
} from './LayersPanel.styles'

export const BASE_MAP_OPTIONS = [
  { value: 'ign-vector', label: 'Plan (IGN)', img: '/img/map/bg-button-map-style-ign-vector.png' },
  { value: 'osm-vector', label: 'Plan (OSM)', img: '/img/map/bg-button-map-style-osm-vector.png' },
  { value: 'ign-ortho', label: 'Vue satellite (IGN)', img: '/img/map/bg-button-map-style-ign-ortho.png' },
]

interface LayersPanelProps {
  id: string
  mapStyle: string
  buttonMapStyle?: string
  isIGNMapStyleAccessible: boolean
  displayLandRegister: boolean
  displayRnbBuildings: boolean
  onMapStyleChange: (style: string) => void
  onLandRegisterChange: (isDisplayed: boolean) => void
  onRnbBuildingsChange: (isDisplayed: boolean) => void
  onClose: () => void
}

function LayersPanel({
  id,
  mapStyle,
  buttonMapStyle,
  isIGNMapStyleAccessible,
  displayLandRegister,
  displayRnbBuildings,
  onMapStyleChange,
  onLandRegisterChange,
  onRnbBuildingsChange,
  onClose,
}: LayersPanelProps) {
  const uid = useId()

  const overlays = [
    {
      key: 'land-register',
      label: 'Parcelles cadastrales',
      img: '/img/map/layer-parcelles-cadastrales.jpg',
      checked: displayLandRegister,
      onChange: onLandRegisterChange,
    },
    {
      key: 'rnb-buildings',
      label: 'Bâtiments (RNB)',
      img: '/img/map/layer-batiments-rnb.png',
      checked: displayRnbBuildings,
      onChange: onRnbBuildingsChange,
    },
  ]

  return (
    <PanelSection
      id={id}
      aria-labelledby={`${uid}-title`}
      onKeyDown={(evt) => {
        if (evt.key === 'Escape') onClose()
      }}
    >
      <PanelHeader>
        <PanelTitle id={`${uid}-title`}>Couches</PanelTitle>
        <button
          type="button"
          className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-close-line"
          title="Fermer le panneau des couches"
          onClick={onClose}
        >
          Fermer le panneau des couches
        </button>
      </PanelHeader>

      <PanelContent>
        <LayerFieldset aria-labelledby={`${uid}-base-maps`}>
          <LayerLegend id={`${uid}-base-maps`}>Fonds de cartes</LayerLegend>
          <LayerGrid>
            {BASE_MAP_OPTIONS.map(({ value, label, img }) => {
              const inputId = `${uid}-map-style-${value}`
              const isDisabled = value === 'ign-vector' && !isIGNMapStyleAccessible
              return (
                <LayerOption key={value}>
                  <input
                    type="radio"
                    id={inputId}
                    name={`${uid}-map-style`}
                    value={value}
                    checked={mapStyle === value}
                    disabled={isDisabled}
                    onChange={() => onMapStyleChange(value)}
                    // Hors couverture IGN, le fond affiché (mapStyle) peut différer du choix
                    // enregistré (buttonMapStyle) : re-cliquer le fond affiché enregistre ce choix.
                    onClick={() => {
                      if (mapStyle === value && buttonMapStyle !== value) onMapStyleChange(value)
                    }}
                  />
                  <label htmlFor={inputId}>
                    <LayerThumbnail>
                      <Image src={img} alt="" width={96} height={96} />
                    </LayerThumbnail>
                    <span>{label}</span>
                    {isDisabled && <LayerHint>Non disponible sur ce territoire</LayerHint>}
                  </label>
                </LayerOption>
              )
            })}
          </LayerGrid>
        </LayerFieldset>

        <LayerFieldset aria-labelledby={`${uid}-overlays`}>
          <LayerLegend>
            <span id={`${uid}-overlays`}>Autres couches</span>
            <Tooltip
              kind="hover"
              // Largeur limitée : centrée sur l'icône, l'info-bulle déborderait à gauche de l'écran
              style={{ maxWidth: '14rem' }}
              title="Les couches de données ne s'affichent qu'à partir d'un certain niveau de zoom : zoomez sur la carte pour les voir apparaître."
            >
              <LayerInfoIcon
                className="ri-information-line"
                tabIndex={0}
                aria-label="Information sur l'affichage des couches"
              />
            </Tooltip>
          </LayerLegend>
          <LayerGrid>
            {overlays.map(({ key, label, img, checked, onChange }) => {
              const inputId = `${uid}-${key}`
              return (
                <LayerOption key={key}>
                  <input
                    type="checkbox"
                    id={inputId}
                    name={key}
                    checked={checked}
                    onChange={evt => onChange(evt.target.checked)}
                  />
                  <label htmlFor={inputId}>
                    <LayerThumbnail>
                      <Image src={img} alt="" width={96} height={96} />
                    </LayerThumbnail>
                    <span>{label}</span>
                  </label>
                </LayerOption>
              )
            })}
          </LayerGrid>
        </LayerFieldset>
      </PanelContent>
    </PanelSection>
  )
}

export default LayersPanel
