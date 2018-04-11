import PropTypes from 'prop-types'

const Address = ({address}) => {
  const {numero, positions, sources} = address
  return (
    <div>
      <h3>Numéro {numero}</h3>
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
    </div>
  )
}

Address.propTypes = {
  address: PropTypes.shape({
    numero: PropTypes.string.isRequired,
    positions: PropTypes.array.isRequired,
    sources: PropTypes.array.isRequired
  }).isRequired
}

export default Address
