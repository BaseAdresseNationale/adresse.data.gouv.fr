import PropTypes from 'prop-types'

import FaDotCircleO from 'react-icons/lib/fa/dot-circle-o'
import FaTags from 'react-icons/lib/fa/tags'
import FaBarcode from 'react-icons/lib/fa/barcode'
import FaHome from 'react-icons/lib/fa/home'

import Tag from '../tag'
import theme from '../../../styles/theme'

const Infos = ({voie}) => (
  <div className='voie-infos'>
    <div className='infos'>
      <h4><FaDotCircleO /> Nombre d’adresse</h4>
      <div>{voie.numeros.length}</div>
    </div>

    <div className='infos'>
      <h4><FaTags /> Noms de la voie</h4>
      {voie.entries.map(entry => (
        <div key={entry.source} className='entries'>
          {entry.nomVoie} <Tag type={entry.source} style={{margin: '3px'}} />
        </div>
      ))}
    </div>

    <div className='infos'>
      <h4><FaHome /> Destination</h4>
      {voie.destination.length > 0 ?
        voie.destination.map(destination => (
          <div key={destination}>
            {destination}
          </div>
        )) :
        <div>Aucune utilisation connue des adresses</div>
      }
    </div>

    <div className='infos'>
      <h4><FaBarcode /> Code de la voie</h4>
      <div>{voie.codeVoie}</div>
    </div>
    <style jsx>{`
      .voie-infos {
        display: grid;
        text-align: center;
        grid-template-columns: repeat(4, 1fr);
        background-color: ${theme.primary};
        color: ${theme.colors.white};
        margin-top: -1em;
        padding: 1em 2em;
      }

      .entries {
        display: flex;
        flex-direction: columns;
        justify-content: space-around;
        align-items: baseline;
      }

      @media (max-width: 749px) {
        .voie-infos {
          grid-template-columns: 50% 50%;
        }
      }
       `}</style>
  </div>
)

Infos.propTypes = {
  voie: PropTypes.shape({
    numeros: PropTypes.array.isRequired,
    entries: PropTypes.array.isRequired,
    codeVoie: PropTypes.string.isRequired
  })
}

export default Infos
