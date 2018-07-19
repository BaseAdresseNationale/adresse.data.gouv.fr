import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'
import FaChevronLeft from 'react-icons/lib/fa/chevron-left'

import Button from '../../../../button'

import Item from '../item'

import ClosablePanel from '../closable-panel'
import AddVoie from './add-voie'

class Voies extends React.Component {
  state = {
    addMode: false
  }

  static propTypes = {
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired
    }).isRequired,
    voies: PropTypes.array.isRequired,
    add: PropTypes.func.isRequired,
    rename: PropTypes.func.isRequired,
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

  handleSubmit = voies => {
    const {add} = this.props
    this.setState({addMode: false})
    add(voies)
  }

  numeros = voie => {
    const {numerosCount} = voie

    if (numerosCount > 0) {
      return `${numerosCount} numéro${numerosCount > 1 ? 's' : ''}`
    }

    return 'Aucun numéro'
  }

  render() {
    const {addMode} = this.state
    const {commune, voies, rename, remove, select} = this.props

    return (
      <div>
        <div>
          <Button onClick={() => select('selectedCommune', null)}><FaChevronLeft /> Liste des communes</Button>

        </div>

        <h1>Liste des voies de {commune.nom}</h1>

        <div className='add-voies'>
          {addMode ? (
            <ClosablePanel title='Ajouter des voies' handleClose={this.handleMode}>
              <AddVoie
                voiesFile={voies}
                onSubmit={this.handleSubmit}
              />
            </ClosablePanel>

          ) : (
            <Button onClick={this.handleMode}>Ajouter des voies <FaPlus /></Button>
          )}
        </div>

        {voies.map(voie => (
          <Item
            key={voie.nom}
            item={voie}
            subitems={this.numeros}
            rename={rename}
            remove={remove}
            select={() => select('selectedVoie', commune)} />
        ))}

        <style jsx>{`
          .add-voies {
            margin-bottom: 2em;
          }
        `}</style>
      </div>
    )
  }
}

export default Voies
