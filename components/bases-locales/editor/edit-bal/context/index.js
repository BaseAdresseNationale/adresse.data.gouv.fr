import React from 'react'
import PropTypes from 'prop-types'

import Changes from '../changes'

import AdaptContext from './adapt-context'

class Context extends React.Component {
  static propTypes = {
    selected: PropTypes.object.isRequired,
    type: PropTypes.string,
    changes: PropTypes.object
  }

  static defaultProps = {
    type: null,
    changes: null
  }

  render() {
    const {selected, type, changes} = this.props

    return (
      <div>
        <div>
          <h2>Contexte</h2>
          <AdaptContext
            selected={selected}
            type={type}
          />
        </div>

        {/* {changes && (
          <Changes
            changes={changes}
            cancelChanges={actions.cancelChanges}
            changeContext={actions.changeContext}
          />
        )} */}

        <style jsx>{`
          .childs {
            margin: 2em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default Context
