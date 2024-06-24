import PropTypes from 'prop-types'

import MoissonneurSourceItem from './source-item'

function MoissonneurSourcesList({sources, sourceSelected, setSourceSelected}) {
  return (
    (sources && sources.length > 0) ? (
      <div className='fr-table'>
        <table>
          <thead>
            <tr>
              <th scope='col'>Nom</th>
              <th scope='col'>Status</th>
              <th scope='col'>Date de mise à jour</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>

          <tbody>
            {sources.map(source => (
              <MoissonneurSourceItem key={source._id} {...source} isSelected={sourceSelected === source._id} onSelect={() => setSourceSelected(source._id)} />
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p>Aucune source</p>
    )
  )
}

MoissonneurSourcesList.propTypes = {
  sources: PropTypes.array.isRequired,
  sourceSelected: PropTypes.string,
  setSourceSelected: PropTypes.func.isRequired
}

export default MoissonneurSourcesList
