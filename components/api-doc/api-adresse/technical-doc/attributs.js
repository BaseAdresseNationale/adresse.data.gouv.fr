import PropTypes from 'prop-types'

import Code from '../code'
import ExpandableMenu from '../expandable-menu'

import ParamsTable from './params-table'

function Attributs({model, defaults, optionals}) {
  return (
    <ExpandableMenu title='Attributs'>
      <div>
        <ParamsTable label='Par défaut' params={defaults} />
        {optionals && (
          <ParamsTable label='Optionnels' params={optionals} />
        )}
      </div>

      <b>Modèle de réponse (par défaut)</b>
      <Code code={JSON.stringify(model, null, 2)} />
    </ExpandableMenu>
  )
}

Attributs.propTypes = {
  model: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]).isRequired,
  defaults: PropTypes.array.isRequired,
  optionals: PropTypes.array
}

Attributs.defaultProps = {
  optionals: null
}

export default Attributs
