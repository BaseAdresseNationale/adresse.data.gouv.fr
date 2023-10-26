import PropTypes from 'prop-types'

const statusColors = {
  'en cours de test': '#ECC94B',
  'en réflexion': '#8d99ae',
  default: '#E2E8F0',
}

const typeColors = {
  'Non défini': '#ced4da',
  API: '#68D391',
  Téléchargement: '#a3cef1',
  default: '#E2E8F0',
}

const getStatusColor = status => statusColors?.[status] || statusColors.default
const getTypeColor = type => typeColors?.[type] || typeColors.default

function AppCard({
  statutIntegration,
  typeIntegration,
  nomApplication,
  descriptionUtilisation,
  imageUtilisateur,
  urlApplication,
  dernierTelechargement,
  nomUtilisateur,
}) {
  return (
    <div className='card'>
      <div className='image-container'>
        <img src={imageUtilisateur} alt={`${nomUtilisateur} Logo`} />  {/* eslint-disable-line @next/next/no-img-element */}
      </div>
      <h3>{nomApplication}</h3>
      <div className='card-description'>
        <p>{descriptionUtilisation}</p>
      </div>
      {dernierTelechargement && <p>Dernier téléchargement: {dernierTelechargement}</p>}
      {urlApplication && <a href={urlApplication} target='_blank' rel='noopener noreferrer'>Voir l‘application</a>}
      <div className='status-type-container'>
        <span style={{backgroundColor: getStatusColor(statutIntegration)}}>{statutIntegration}</span>
        <span style={{backgroundColor: getTypeColor(typeIntegration)}}>{typeIntegration}</span>
      </div>

      <style jsx>{`
        .card {
          border: 1px solid #eaeaea;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .card-description {
          flex: 1;
        }
        .image-container {
          width: 250px;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        img {
          max-width: 100%;
          max-height: 100%;
          object-fit: cover;
        }
        .status-type-container {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .status-type-container span {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: white;
          font-size: 13px;
        }
      `}</style>
    </div>
  )
}

AppCard.propTypes = {
  typeIntegration: PropTypes.string.isRequired,
  nomApplication: PropTypes.string.isRequired,
  descriptionUtilisation: PropTypes.string.isRequired,
  imageUtilisateur: PropTypes.string.isRequired,
  urlApplication: PropTypes.string,
  dernierTelechargement: PropTypes.string,
  nomUtilisateur: PropTypes.string.isRequired,
  statutIntegration: PropTypes.string.isRequired,
}

export default AppCard
