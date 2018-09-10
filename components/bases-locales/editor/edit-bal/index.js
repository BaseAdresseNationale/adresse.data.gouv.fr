import React from 'react'
import PropTypes from 'prop-types'

import BAL from '../../../../lib/bal/api'

import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

const genCode = () => {
  return Math.floor((Math.random() * 9999) + 1000).toString()
}

const getType = item => {
  if (item.code) {
    return 'commune'
  }

  if (item.nomVoie) {
    return 'voie'
  }

  return 'numero'
}

class EditBal extends React.Component {
  constructor(props) {
    super(props)

    this.bal = new BAL(props.tree)

    this.state = {
      communes: null,
      commune: null,
      voie: null,
      numero: null
    }
  }

  static propTypes = {
    tree: PropTypes.object,
    reset: PropTypes.func.isRequired
  }

  static defaultProps = {
    tree: null
  }

  componentDidMount = async () => {
    const {communes} = this.state

    if (!communes) {
      const communes = await this.bal.getCommunes()
      this.setState({communes})
    }
  }

  addItem = async item => {
    const type = getType(item)
    const types = {
      commune: this.addCommune,
      voie: this.addVoie,
      numero: this.addNumero
    }

    await types[type](item)
  }

  addCommune = async newCommune => {
    await this.bal.createCommune(newCommune.code, newCommune)
  }

  addVoie = async newVoie => {
    const {commune} = this.state

    newVoie.codeVoie = genCode() // TODO
    newVoie.idVoie = `${commune.code}-${newVoie.codeVoie}`
    await this.bal.createVoie(commune.code, newVoie)
  }

  addNumero = async newNumero => {
    const {commune, voie} = this.state
    await this.bal.createNumero(commune.code, voie.codeVoie, newNumero)
  }

  renameVoie = async (item, newName) => {
    const {commune} = this.state
    await this.bal.renameVoie(commune.code, item.codeVoie, newName)
  }

  deleteItem = async item => {
    const {commune, voie} = this.state
    const type = getType(item)

    switch (type) {
      case 'commune':
        await this.bal.deleteCommune(item.code)
        break
      case 'voie':
        await this.bal.deleteVoie(commune.code, item.codeVoie)
        break
      default:
        await this.bal.deleteNumero(commune.code, voie.codeVoie, item.numeroComplet)
        break
    }
  }

  cancelChange = async item => {
    const {commune, voie} = this.state
    const type = getType(item)

    switch (type) {
      case 'commune':
        await this.bal.cancelCommuneChange(item.code)
        break
      case 'voie':
        await this.bal.cancelVoieChange(commune.code, item.codeVoie)
        break
      default:
        await this.bal.cancelNumeroChange(commune.code, voie.codeVoie, item.numeroComplet)
        break
    }
  }

  select = async (codeCommune, codeVoie, numeroComplet) => {
    const commune = await this.bal.getCommune(codeCommune)
    const voie = await this.bal.getVoie(codeCommune, codeVoie)
    const numero = await this.bal.getNumero(codeCommune, codeVoie, numeroComplet)

    this.setState({
      commune,
      voie,
      numero
    })
  }

  render() {
    const {communes, commune, voie, numero} = this.state
    const {reset} = this.props
    const actions = {
      select: this.select,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      renameVoie: this.renameVoie,
      cancelChange: this.cancelChange
    }

    return (
      <div>
        <FormContext.Provider value={{commune, voie, numero, actions}}>
          {commune ? (
            <Context
              commune={commune}
              voie={voie}
              numero={numero}
            />
          ) : (
            <Communes
              communes={communes}
              actions={actions}
              reset={reset}
            />
          )}
        </FormContext.Provider>
      </div>
    )
  }
}

export default EditBal
