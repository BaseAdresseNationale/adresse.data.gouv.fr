import React from 'react'
import PropTypes from 'prop-types'

import BAL from '../../../../lib/bal/api'

import Context from './context'
import Communes from './communes'

export const FormContext = React.createContext()

const getType = item => {
  if (item.code) {
    return 'commune'
  }

  if (item.codeVoie) {
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
      numero: null,
      changes: {communes: {}, voies: {}, numeros: {}},
      error: null
    }
  }

  static propTypes = {
    tree: PropTypes.object
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
    const {changes} = this.state
    let error

    try {
      const commune = await this.bal.createCommune(newCommune.code, newCommune)
      changes.communes[commune.code] = commune
    } catch (err) {
      error = new Error(err)
    }

    this.setState({
      changes,
      error
    })
  }

  addVoie = async newVoie => {
    const {commune, changes} = this.state
    let voie
    let error

    try {
      const voie = await this.bal.createVoie(commune.code, newVoie)
      changes.voies[voie.codeVoie] = voie
    } catch (err) {
      error = new Error(err)
    }

    this.setState({
      voie,
      changes,
      error
    })
  }

  addNumero = async newNumero => {
    const {commune, voie, changes} = this.state
    let numero
    let error

    try {
      numero = await this.bal.createNumero(commune.code, voie.codeVoie, newNumero)
      changes.numeros[numero.numeroComplet] = numero
    } catch (err) {
      error = new Error(err)
    }

    this.setState({
      numero,
      changes,
      error
    })
  }

  renameItem = async (item, newName) => {
    const {commune, voie} = this.state
    const type = getType(item)
    let error = null

    try {
      if (type === 'voie') {
        await this.bal.renameVoie(commune.code, item.codeVoie, newName)
      } else {
        const change = {type: 'rename', value: newName}
        await this.bal.updateNumero(commune.code, voie.codeVoie, item.numeroComplet, change)
      }
    } catch (err) {
      error = new Error(err)
    }

    this.setState({error})
  }

  deleteItem = async item => {
    const {commune, voie, changes} = this.state
    const type = getType(item)
    let error = null

    try {
      switch (type) {
        case 'commune':
          await this.bal.deleteCommune(item.code)
          await this.bal.getCommunes()
          // Changes[item.code] = {item, change: {type: 'delete', value: true}}
          break
        case 'voie':
          await this.bal.deleteVoie(commune.code, item.codeVoie)
          break
        default:
          await this.bal.deleteNumero(commune.code, voie.codeVoie, item.numeroComplet)
          break
      }
    } catch (err) {
      error = new Error(err)
    }

    this.setState(() => {
      return {
        changes,
        error
      }
    })
  }

  cancelChange = async item => {
    const {commune, voie} = this.state
    const type = getType(item)
    let error = null

    try {
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
    } catch (err) {
      error = new Error(err)
    }

    this.setState({error})
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
    const {communes, commune, voie, numero, error} = this.state
    const actions = {
      select: this.select,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      renameItem: this.renameItem,
      cancelChange: this.cancelChange
    }

    return (
      <div>
        <FormContext.Provider value={{commune, voie, numero, error, actions}}>
          {commune ? (
            <Context
              commune={commune}
              voie={voie}
              numero={numero}
              changes={{}}
            />
          ) : (
            <Communes
              communes={communes}
              actions={actions}
              error={error}
            />
          )}
        </FormContext.Provider>
      </div>
    )
  }
}

export default EditBal
