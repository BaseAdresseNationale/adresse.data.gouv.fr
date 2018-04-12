import PropTypes from 'prop-types'
import MdClose from 'react-icons/lib/md/close'

import theme from '../../../styles/theme'

const Address = ({address, onClose}) => {
  const {numero, positions, sources} = address
  return (
    <div>
      <div className='head'>
        <h3>Numéro {numero}</h3>
        <div className='close' onClick={() => onClose()}><MdClose /></div>
      </div>
      <div>
        Positions :
        {positions.map((position, idx) => (
          <div key={sources[idx]}>
            <h5>{sources[idx]}</h5>
            <ul>
              {position.coordinates.map(coordinate => (
                <li key={coordinate}>
                  {coordinate}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <style jsx>{`
        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close {
          font-size: 20px;
          padding: 0px 2px;
        }

        .close:hover {
          color:  ${theme.primary};
          cursor: pointer;
        }
        `}</style>
    </div>
  )
}

Address.propTypes = {
  address: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Address
