import PropTypes from 'prop-types'

import theme from '../../styles/theme'

const types = {
  locality: 'Lieu-dit',
  street: 'Voie',
  housenumber: 'Numéro'
}

const PopupAddress = ({address}) => {
  const {context, name, postcode, citycode, type, city} = address.properties
  return (
    <div className='popup'>
      <h4>{types[type]}</h4>
      <div>
        <div>{name}</div>
        <div>{postcode} {city}</div>
        <div className='divider' />
        <div>Code INSEE : {citycode}</div>
        <div>Contexte : {context}</div>
      </div>

      <style jsx>{`
        .divider {
          width: 50%;
          margin: 1.2em auto;
          border-top: 1px solid ${theme.borderLighter};
        }

        .popup {
          z-index: 1;
          position: fixed;
          padding: 0 1em 1em 1em;
          bottom: 20px;
          left: 50%;
          min-width: 200px;
          max-width: 90%;
          transform: translate(-50%);
          background: #ffffffc0;
          border: 1px solid ${theme.border};
        }

        @media (max-width: 700px) {
          .popup {
            position: absolute;
            bottom: 0;
            left: 0;
            border: none;
            min-width: 100%;
            transform: none;
            border-top: 1px solid ${theme.border};
          }
        }
      `}</style>
    </div>
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
