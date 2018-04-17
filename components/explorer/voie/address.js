import PropTypes from 'prop-types'
import MdClose from 'react-icons/lib/md/close'

import theme from '../../../styles/theme'

const precisionRound = (number, precision) => {
  const factor = Math.pow(10, precision)
  return Math.round(number * factor) / factor
}

const Address = ({voie, address, onClose}) => {
  const {numero, entries, active, pseudoNumero} = address

  return (
    <div>
      <div className='head'>
        <h4>Numéro {numero}</h4>
        <div className='close' onClick={() => onClose()}><MdClose /></div>
      </div>

      {active && !pseudoNumero && <h5>{numero} {voie.nomVoie} - {voie.codeCommune} {voie.nomCommune}</h5>}

      <div>
        Positions :
        {entries.map(entry => (
          <div key={entry.source} className='position'>
            <div className='source'><h5>{entry.source}</h5></div>
            <div className='coordinates'>
              {entry.position.coordinates.map(coordinate => (
                <div key={coordinate} className='coordinate'>
                  {precisionRound(coordinate, 5)}
                </div>
            ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .close {
          font-size: 20px;
          padding: 0px 2px;
        }

        .close:hover {
          color:  ${theme.primary};
          cursor: pointer;
        }

        .position {
          display: grid;
          grid-column-gap: 5px;
          margin: 10px 0;
          grid-template-columns: 0.5fr 1fr;
        }

        .source {
          grid-column: 1;
          text-align: center;
          background-color: ${theme.colors.lighterGrey};
        }

        .coordinates {
          grid-column: 2;
          display: grid;
          grid-row-gap: 5px;
          grid-template-rows: 50%;
          text-align: center;
        }

        .coordinate {
          align-self: center;
          padding: 5px;
          background-color: ${theme.colors.lightGrey};
        }
        `}</style>
    </div>
  )
}

Address.propTypes = {
  voie: PropTypes.shape({
    nomVoie: PropTypes.string.isRequired,
    codeCommune: PropTypes.string.isRequired,
    nomCommune: PropTypes.string.isRequired
  }),
  address: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    position: PropTypes.object.isRequired,
    sources: PropTypes.array.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Address
