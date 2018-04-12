import PropTypes from 'prop-types'

import FaDotCircleO from 'react-icons/lib/fa/dot-circle-o'
import FaTags from 'react-icons/lib/fa/tags'
import FaBarcode from 'react-icons/lib/fa/barcode'
import FaDatabase from 'react-icons/lib/fa/database'

import theme from '../../../styles/theme'

const Voie = ({voie}) => (
  <div className='voie-infos'>
    <div className='infos'>
      <h4><FaDotCircleO /> Nombre d’adresse</h4>
      <div>{voie.nbNumeros}</div>
    </div>

    <div className='infos'>
      <h4><FaTags /> Noms de la voie</h4>
      {voie.nomsVoie.map(nom => <div key={nom}>{nom}</div>)}
    </div>

    <div className='infos'>
      <h4><FaDatabase /> Sources</h4>
      {voie.sources.map(source => <div key={source}>{source}</div>)}
    </div>

    <div className='infos'>
      <h4><FaBarcode /> Code de la voie</h4>
      <div>{voie.codeVoie}</div>
    </div>
    <style jsx>{`
      .voie-infos {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        flex-flow: wrap;
        background-color: ${theme.primary};
        color: ${theme.colors.white};
        margin-top: -1em;
        padding: 1em 2em;
      }

      .infos div {
        text-align: center;
      }
      `}</style>
  </div>
)

Voie.propTypes = {
  voie: PropTypes.shape({
    nbNumeros: PropTypes.number.isRequired,
    nomsVoie: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired,
    codeVoie: PropTypes.string.isRequired
  })
}

export default Voie
