import React from 'react'
import PropTypes from 'prop-types'

import Changes from '../changes'

import AdaptContext from './adapt-context'
import {ItemContext} from '..'

class Context extends React.Component {
  static propTypes = {
    changes: PropTypes.object,
    context: PropTypes.shape({
      item: PropTypes.object.isRequired,
      type: PropTypes.string.isRequired
    }).isRequired
  }

  static defaultProps = {
    changes: null
  }

  render() {
    const {context, changes} = this.props
    const {type, item} = context

    return (
      <div>
        <div>
          <h2>Contexte</h2>
          <AdaptContext
            context={context}
            type={type}
            item={item}
          />
        </div>

        {changes && changes.length > 0 && (
          <ItemContext.Consumer>
            {actions => (
              <Changes
                changes={changes}
                cancelChanges={actions.cancelChanges}
                changeContext={actions.changeContext}
              />
            )}
          </ItemContext.Consumer>
        )}

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
