import {useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import {MapPin} from 'react-feather'
import {Marker} from 'react-map-gl/maplibre'
import {positionTypeOptions} from './use-signalement'

function SignalementMap({signalement, onEditSignalement}) {
  const {positions} = signalement.changesRequested
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
  onEditSignalement: PropTypes.func.isRequired
}

export default SignalementMap
