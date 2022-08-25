import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import PostalCodes from '@/components/base-adresse-nationale/postal-codes'

function CommuneIdCard({region, departement, codesPostaux, population, color, size}) {
  return (
    <div className='general-infos-container'>
      <div className='info-container'>
        <div className='label'>Région</div>
        <div className='value'>{region.nom}</div>
      </div>
      <div className='info-container'>
        <div className='label'>Département</div>
        <div className='value'>{departement.nom} ({departement.code})</div>
      </div>
      <div className='info-container'>
        <div className='label'>Code Postal</div>
        <div className='value'>{<PostalCodes codes={codesPostaux} />}</div>
      </div>
      <div className='info-container'>
        <div className='label'>Population</div>
        <div className='value'>{population} habitants</div>
      </div>

      <style jsx>{`
        .general-infos-container {
          color: ${color === 'primary' ? theme.colors.white : theme.darkText};
          background: ${color === 'primary' ? theme.primary : theme.backgroundGrey};
          border-radius: 8px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${size === 'regular' ? '250px' : '40px'}, 1fr));
          gap: 1em;
          padding: 10px;
        }

        .info-container {
          background: transparent;
          display: grid;
          grid-template-rows: .5fr 1fr;
          align-items: center;
          justify-content: center;
          height: fit-content;
        }

        .label {
          background: none;
          padding: 0;
          color: ${color === 'secondary' ? theme.primary : ''};
          font-size: ${size === 'regular' ? '20px' : '15px'};
          font-weight: bold;
          justify-self: center;
        }

        .value {
          font-weight: 100;
          font-size: ${size === 'regular' ? '18px' : '14px'};
          justify-self: center;
        }
      `}</style>
    </div>
  )
}

CommuneIdCard.propTypes = {
  region: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }).isRequired,
  departement: PropTypes.shape({
    code: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired
  }).isRequired,
  population: PropTypes.number.isRequired,
  codesPostaux: PropTypes.array.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'secondary'
  ]),
  size: PropTypes.oneOf([
    'regular',
    'small',
  ])
}

CommuneIdCard.defaultProps = {
  color: 'primary',
  size: 'regular'
}

export default CommuneIdCard
