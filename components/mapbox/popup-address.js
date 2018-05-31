import PropTypes from 'prop-types'
import {Popup} from 'react-mapbox-gl'

const types = {
  locality: 'Lieu-dit',
  street: 'Voie',
  housenumber: 'Numéro'
}

const PopupAddress = ({address}) => {
  const {context, name, postcode, citycode, type, city} = address.properties
  return (
    <Popup
      anchor='top'
      coordinates={address.geometries.coordinates}
      offset={50}>
      <div className='container'>
        <div>
          <h4>{types[type]}</h4>
          <div>{name}</div>
          <div>{postcode} {city}</div>
          <div>Code INSEE : {citycode}</div>
          <div>Contexte : {context}</div>
        </div>

        <style jsx>{`
          .container {
            padding: 8px;
            border-radius: 2px;
            font-size: 12px;
            line-height: 15px;
          }
        `}</style>
      </div>
    </Popup>
  )
}

PopupAddress.propTypes = {
  address: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.array.isRequired
    }).isRequired,
    properties: PropTypes.shape({
      context: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      postcode: PropTypes.string.isRequired,
      citycode: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default PopupAddress
