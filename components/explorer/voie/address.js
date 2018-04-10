import PropTypes from 'prop-types'

const Address = ({address}) => {
  const {numero, positions, sources} = address
  return (
    <div>
      <h3>Numéro {numero}</h3>
      <div>
        Positions :
        {positions.map(position => (
          <ul key={`${position.coordinates[0]}-${position.coordinates[1]}`}>
            {position.coordinates.map(coordinate => (
              <li key={coordinate}>
                {coordinate}
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div>
        Sources :
        <ul>
          {sources.map(source => (
            <li key={source}>
              <div>{source}</div>
            </li>
          ))}
        </ul>
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
