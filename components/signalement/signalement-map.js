import {useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {MapPin} from 'react-feather'
import {Marker, Layer, Source, useMap} from 'react-map-gl/maplibre'
import {positionTypeOptions} from './use-signalement'
import {cadastreLayers} from '../maplibre/ban-map/layers'
import {useCadastre, parcelleHoveredLayer} from './use-cadastre'

function SignalementMap({signalement, onEditSignalement, isEditParcellesMode}) {
  const {positions, parcelles} = signalement.changesRequested
  const map = useMap()
  const {cadastreFiltre} = useCadastre({map, parcelles, isCadastreDisplayed: isEditParcellesMode, handleEditParcelle: onEditSignalement('changesRequested', 'parcelles')})

  const onMarkerDrag = useCallback(index => event => {
    const newPositions = [...positions]
    newPositions[index] = {
      ...newPositions[index],
      position: {
        type: 'Point',
        coordinates: [event.lngLat.lng, event.lngLat.lat]
      }
    }
    onEditSignalement('changesRequested', 'positions')(newPositions)
  }, [positions, onEditSignalement])

  const signalementLabel = useMemo(() => {
    const {numero, suffixe, nomVoie} = signalement.changesRequested

    return [numero, suffixe, nomVoie].reduce((acc, cur) => { // eslint-disable-line unicorn/no-array-reduce
      return cur ? `${acc} ${cur}` : acc
    }, '')
  }, [signalement.changesRequested])

  const getSignalementPositionLabel = useCallback(positionType => {
    const positionTypeLabel = positionTypeOptions.find(({value}) => value === positionType).label
    return `${signalementLabel} - ${positionTypeLabel}`
  }, [signalementLabel])

  const getSignalementPositionColor = useCallback(positionType => {
    return positionTypeOptions.find(({value}) => value === positionType).color
  }, [])

  return (
    <>
      <Source id='cadastre'
        type='vector'
        url='https://openmaptiles.geo.data.gouv.fr/data/cadastre.json'
      >
        {[...cadastreLayers, parcelleHoveredLayer].map(cadastreLayer => {
          if (cadastreLayer.id === 'parcelle-highlighted') {
            cadastreLayer.filter = cadastreFiltre
          }

          return <Layer key={cadastreLayer.id} {...cadastreLayer} layout={{...cadastreLayer.layout, visibility: isEditParcellesMode ? 'visible' : 'none'}} />
        }
        )}
      </Source>
      {positions.map(({position, positionType}, index) => (
        <Marker
          key={index} // eslint-disable-line react/no-array-index-key
          longitude={position.coordinates[0]}
          latitude={position.coordinates[1]}
          anchor='bottom'
          draggable
          onDrag={onMarkerDrag(index)}
        >
          <label className='map-pin-label' style={{color: getSignalementPositionColor(positionType)}}>{getSignalementPositionLabel(positionType)}</label>
          <style jsx>{`
            .map-pin-label {
              position: absolute;
              top: -20px;
              white-space: nowrap;
              transform: translateX(calc(-50% + 10px));
            }
          `}</style>
          <MapPin size={20} color={getSignalementPositionColor(positionType)} />
        </Marker>
      ))}
    </>

  )
}

SignalementMap.propTypes = {
  signalement: PropTypes.object.isRequired,
  onEditSignalement: PropTypes.func.isRequired,
  isEditParcellesMode: PropTypes.bool.isRequired,
}

export default SignalementMap
