import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import Item from '../item'
import ClosablePanel from '../closable-panel'
import AddCommunes from './add-communes'

class Communes extends React.Component {
  state = {
    addMode: false
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  }

  handleMode = event => {
    event.preventDefault()

    this.setState(state => {
      return {
        addMode: !state.addMode
      }
    })
  }

  handleSubmit = communes => {
    const {add} = this.props
    this.setState({addMode: false})
    add(communes)
  }

  voies = commune => {
    const {voiesCount} = commune

    if (voiesCount > 0) {
      return `${voiesCount} voie${voiesCount > 1 ? 's' : ''}`
    }

    return 'Aucune voie'
  }

  render() {
    const {addMode} = this.state
    const {communes, remove, select} = this.props

    return (
      <div>
        <h1>Liste des communes</h1>

        <div className='add-communes'>
          {addMode ? (
            <ClosablePanel title='Ajouter des communes' handleClose={this.handleMode}>
              <AddCommunes
                communesFile={communes}
                onSubmit={this.handleSubmit}
              />
            </ClosablePanel>
          ) : (
            <Button onClick={this.handleMode}>Ajouter des communes <FaPlus /></Button>
          )}
        </div>

        {communes.map(commune => (
          <Item
            key={commune.nom}
            subitems={this.voies}
            item={commune}
            remove={() => remove('communes', commune)}
            select={() => select('selectedCommune', commune)}
          />
        ))}

        <style jsx>{`
          .add-communes {
            margin-bottom: 2em;
          }
        `}</style>
      </div>
    )
  }
}

export default Communes
