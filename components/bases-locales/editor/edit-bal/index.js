import React from 'react'
import PropTypes from 'prop-types'

import BAL from '../../../../lib/bal/api'

import Context from './context'

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
      selected: null,
      type: null,
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
    const {selected} = this.state

    if (!selected) {
      this.setState({
        selected: await this.bal.getCommunes()
      })
    }
  }

  getCode = item => {
    const {selected} = this.state
    const type = getType(item)
    let code = null

    switch (type) {
      case 'commune':
        code = item.code
        break
      case 'voie':
        code = `${selected.code}-${item.codeVoie}`
        break
      default:
        code = `${selected.idVoie}-${item.numero}`
        break
    }

    return code
  }

  addItem = async item => {
    const type = getType(item)
    let selected = null
    let error = null

    try {
      switch (type) {
        case 'commune':
          await this.bal.deleteCommune(item.code)
          selected = await this.bal.getCommunes()
          break
        case 'voie':
          await this.bal.deleteVoie(item.idVoie)
          selected = await this.bal.getCommune(item.idVoie.split('-')[0])
          break
        default:
          await this.bal.deleteNumero(item.id)
          selected = await this.bal.getVoie(`${item.id.split('-')[0]}-${item.id.split('-')[1]}`)
          break
      }
    } catch (err) {
      error = err
    }

    this.setState(state => {
      return {
        selected: selected || state.selected,
        error
      }
    })
  }

  renameItem = async (item, newName) => {
    const type = getType(item)
    const code = this.getCode(item)
    let selected = null
    let error = null

    try {
      if (type === 'voie') {
        selected = await this.bal.renameVoie(code, newName)
      } else {
        selected = await this.bal.updateNumero(code, {type: 'rename', value: newName})
      }
    } catch (err) {
      error = err
    }

    this.setState(state => {
      return {
        selected: selected || state.selected,
        error
      }
    })
  }

  deleteItem = async item => {
    const {changes} = {...this.state}
    const type = getType(item)
    const code = this.getCode(item)
    let selected = null
    let error = null

    try {
      switch (type) {
        case 'commune':
          await this.bal.deleteCommune(code)
          selected = await this.bal.getCommunes()
          changes[code] = {item, change: {type: 'delete', value: true}}
          break
        case 'voie':
          selected = await this.bal.createVoie(code, item)
          break
        default:
          selected = await this.bal.getNumero(code, item)
          break
      }
    } catch (err) {
      error = err
    }

    this.setState(state => {
      return {
        selected: error ? state.selected : selected,
        changes,
        error
      }
    })
  }

  cancelChange = async item => {
    const type = getType(item)
    const code = this.getCode(item)
    let error = null

    try {
      switch (type) {
        case 'commune':
          await this.bal.cancelCommuneChange(code)
          break
        case 'voie':
          await this.bal.cancelVoieChange(code)
          break
        default:
          await this.bal.cancelNumeroChange(code)
          break
      }
    } catch (err) {
      error = err
    }

    this.setState({error})
  }

  select = async item => {
    const type = item ? getType(item) : null
    let selected

    switch (type) {
      case 'commune':
        selected = await this.bal.getCommune(item.code)
        break
      case 'voie':
        selected = await this.bal.getVoie(item.codeVoie)
        break
      case 'numero':
        selected = await this.bal.getNumero(item.id)
        break
      default:
        selected = await this.bal.getCommunes()
        break
    }

    this.setState({selected, type})
  }

  render() {
    const {selected, type, error} = this.state
    const actions = {
      select: this.select,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      renameItem: this.renameItem,
      cancelChanges: this.cancelChange,
      previousContext: this.previousContext
    }

    return (
      <div>
        {selected && (
          <FormContext.Provider value={{error, ...actions}}>
            <Context
              selected={selected}
              type={type}
              changes={{}}
            />
          </FormContext.Provider>
        )}
      </div>
    )
  }
}

export default EditBal
