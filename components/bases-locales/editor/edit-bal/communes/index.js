import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import Commune from './commune'
import AddCommunes from './add-communes'

class Communes extends React.Component {
  state = {
    addMode: false
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    rename: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    fix: PropTypes.func.isRequired,
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

  render() {
    const {addMode} = this.state
    const {communes, rename, fix, remove, select} = this.props

    return (
      <div>
        <h1>Liste des communes</h1>

        <div className='add-communes'>
          {addMode ?
            <AddCommunes
              communesFile={communes}
              onSubmit={this.handleSubmit}
              close={() => this.setState({addMode: false})} /> :
            <Button onClick={this.handleMode}>Ajouter des communes <FaPlus /></Button>
          }
        </div>

        {communes.map(commune => (
          <Commune
            key={commune.nom}
            commune={commune}
            rename={rename}
            magic={fix}
            remove={remove}
            select={select} />
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
