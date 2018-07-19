import React from 'react'
import PropTypes from 'prop-types'
import FaPlus from 'react-icons/lib/fa/plus'

import Button from '../../../../button'

import PositionForm from './position-form'

class AddNumero extends React.Component {
  state = {
    numero: null,
    positions: []
  }

  static propTypes = {
    communes: PropTypes.array.isRequired,
    commune: PropTypes.shape({
      center: PropTypes.object.isRequired,
      contour: PropTypes.object.isRequired
    }).isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  componentDidMount = () => {
    this.addPosition()
  }

  addPosition = () => {
    const {commune} = this.props

    this.setState(state => {
      const {positions} = state

      positions.push({
        id: positions.length + 1,
        coords: commune.center.coordinates,
        dateMAJ: null,
        sources: [],
        type: null
      })

      return {
        positions
      }
    })
  }

  handlePositionSources = (position, sources) => {
    position.sources = sources

    this.setState(state => {
      const {positions} = state
      return {
        positions // TODO immutability
      }
    })
  }

  handleNumero = numero => {
    this.setState({numero})
  }

  handleCommune = commune => {
    this.setState({selectedCommune: commune})
  }

  handleSave = event => {
    const {numero, positions} = this.state
    const {onSubmit} = this.props

    event.preventDefault()

    onSubmit({
      numero,
      positions
    })
  }

  render() {
    const {positions} = this.state
    const {communes} = this.props

    return (
      <div>
        <form>
          <label>Numéro</label>
          <input type='text' />

          <label>Lieu-dit</label>
          <input type='radio' />

          <label>Commune</label>
          <select>
            {communes.map(commune => (
              <option key={commune.code} value={commune.nom}>
                {commune.nom}
              </option>
            ))}
          </select>

          {selectedCommune && (
            <div>
              <label>Voie</label>
              <select>
                {communes.voies.map(voie => (
                  <option key={voie.codeVoie} value={voie.nomVoie}>
                    {voie.nomVoie}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button onClick={this.addPosition}>Ajouter une position <FaPlus /></Button>
        </form>

        <div className='map'>
          <h3>Carte</h3>
          <p>
            Cette carte affiche les contours de la commune séléctionnée.
            Voir les contours permettrait de placer plus facilement les nouvelles adresses.
            Cependant il est nécessaire de récupérer ces contours via la geo-api pour les communes déjà présente dans le fichier.
            Sans contours, le centre de la commune pourrait au moins permettre d’avoir une position de départ.
            Le centre pourrait être la position par défaut lors de la création d’une position.
          </p>

          <p>
            Au centre de la carte l’utilisateur peut trouver un point.
            Ce point être déplacer à l’endroit souhaité sur la carte.
          </p>
        </div>

        <div className='positions'>
          {positions.map(position => (
            <PositionForm
              key={position.id}
              position={position}
              handleType={this.handleType}
              handleSources={this.handleSources}
            />
          ))}
        </div>

        <div className='centered'>
          <Button type='submit' onClick={this.handleSave}>Enregister</Button>
        </div>

        <style jsx>{`
          .map {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2em;
            width: 100%;
            height: 460px;
            background-color: grey;
            color: white;
          }

          form {
            margin: 1em 0;
            display: flex;
            flex-direction: column;
          }

          label {
            margin: 0.5em 0;
          }

          .positions {
            display: flex;
            flex-flow: wrap;
          }

          .centered {
            display: flex;
            justify-content: center;
            margin: 1em 0;
          }
        `}</style>
      </div>
    )
  }
}

export default AddNumero
