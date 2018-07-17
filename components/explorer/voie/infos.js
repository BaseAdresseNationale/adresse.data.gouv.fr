import React from 'react'
import PropTypes from 'prop-types'

import FaDotCircleO from 'react-icons/lib/fa/dot-circle-o'
import FaTags from 'react-icons/lib/fa/tags'
import FaBarcode from 'react-icons/lib/fa/barcode'
import FaHome from 'react-icons/lib/fa/home'

import {getTypeByPriority} from '../../../lib/types'

import Tag from '../../tag'
import theme from '../../../styles/theme'

const Infos = ({voie}) => (
  <div className='voie-infos'>
    <div className='infos'>
      <h4><FaDotCircleO /> Nombre d’adresses</h4>
      <div>{voie.numeros.length}</div>
    </div>

    <div className='infos'>
      <h4><FaTags /> Noms de la voie</h4>
      {voie.entries.map(entry => (
        <div key={entry.source} className='entries'>
          <Tag type={entry.source} />
          {entry.nomVoie}
        </div>
      ))}
    </div>

    <div className='infos'>
      <h4><FaHome /> Destination</h4>
      <div className='destination'>
        {voie.destination.length > 0 ?
          getTypeByPriority(voie.destination).map(destination => (
            <div key={destination}>
              <Tag type={destination} />
            </div>
          )) :
          <div>Aucune utilisation connue des adresses</div>
        }
      </div>
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
        justify-content: center;
        align-items: center;
      }

      .destination {
        display: flex;
        justify-content: center;
        flex-flow: wrap;
      }

      @media (max-width: 749px) {
        .voie-infos {
          grid-template-columns: 50% 50%;
        }
      }

      @media (max-width: 460px) {
        .voie-infos {
          display: flex;
          flex-direction: column;
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

Infos.defaultProps = {
  voie: null
}

export default Infos
