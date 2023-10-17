import React from 'react';

const AppCard = ({ data }) => {

  const getStatusColor = (status) => {
    switch(status) {
      case 'en production': return '#68D391'; 
      case 'en cours de test': return '#ECC94B'; 
      case 'en réflexion': return '#8d99ae'; 
      // Add other cases if there are more status types
      default: return '#E2E8F0'; // Default color
    }
  }

  const getTypeColor = (type) => {
    switch(type) {      
    case 'Non défini': return '#ced4da'; 
    case 'API': return '#68D391'; 
    case 'Téléchargement': return '#a3cef1'; 
    default: return '#E2E8F0'; // Default color
  }
  }

  return (
    <div className="card">
      <div className="image-container">
        <img src={data.image_utilisateur} alt={`${data.nom_utilisateur} Logo`} />
      </div>
      <h3>{data.nom_application}</h3>
      <p>{data.description_utilisation}</p>
      {data.dernier_telechargement && <p>Dernier téléchargement: {data.dernier_telechargement}</p>}
      {data.url_application && <a href={data.url_application} target="_blank" rel="noopener noreferrer">Voir l'application</a>}
      <div className="status-type-container">
        <span style={{ backgroundColor: getStatusColor(data.statut_integration) }}>{data.statut_integration}</span>
        <span style={{ backgroundColor: getTypeColor(data.type_integration) }}>{data.type_integration}</span>
      </div>
      <style jsx>{`
        .card {
          border: 1px solid #eaeaea;
          padding: 1rem;
          margin: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
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
  );  
}

export default AppCard;
