import React from 'react'
import PropTypes from 'prop-types'

import BAL from '../../../../lib/bal/api'

import Context from './context'
import CommunesList from './communes/communes-list'

export const FormContext = React.createContext()

const getType = item => {
  if (item.voies) {
    return 'commune'
  }

  if (item.numeros) {
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
    const {code} = this.state.commune
    const {codeVoie} = this.state.voie

    const type = getType(item)
    let communes
    let commune
    let voie
    let error

    try {
      if (type === 'commune') {
        await this.bal.deleteCommune(item.code)
        communes = await this.bal.getCommunes()
      } else if (type === 'voie') {
        await this.bal.deleteVoie(code, item.idVoie)
        commune = await this.bal.getCommune(code)
      } else {
        await this.bal.deleteNumero(code, codeVoie, item.numeroComplet)
        voie = await this.bal.getVoie(code, codeVoie)
      }
    } catch (err) {
      error = err
    }

    this.setState(() => {
      return {
        communes,
        commune,
        voie,
        error
      }
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
      error = err
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
          // changes[item.code] = {item, change: {type: 'delete', value: true}}
          break
        case 'voie':
          await this.bal.deleteVoie(commune.code, item.codeVoie)
          break
        default:
          await this.bal.deleteNumero(commune.code, voie.codeVoie, item.numeroComplet)
          break
      }
    } catch (err) {
      error = err
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
      error = err
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
          {commune && (
            <Context
              commune={commune}
              voie={voie}
              numero={numero}
              changes={{}}
            />
          )}
        </FormContext.Provider>

        {!commune && communes && (
          <CommunesList communes={communes} actions={actions} />
        )}
      </div>
    )
  }
}

export default EditBal
