// eslint-disable-next-line import/no-unassigned-import
// import 'regenerator-runtime/runtime'
import React from 'react'

import theme from '../../../styles/theme'

import Button from '../../button'
import BAL from '../../../lib/bal/model'

import Uploader from './uploader'
import EditBal from './edit-bal'

function getDownloadLink(csvContent) {
  const blob = new Blob([csvContent], {type: 'text/csv'})
  return URL.createObjectURL(blob)
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

class Editor extends React.Component {
  initialState = {
    model: null,
    communes: null,
    commune: null,
    voie: null,
    numero: null,
    downloadLink: null,
    loading: false,
    error: null
  }

  state = {
    ...this.initialState
  }

  handleData = async tree => {
    const model = new BAL(tree)
    const communes = await model.getCommunes()

    this.setState({
      model,
      communes
    })
  }

  createNewFile = () => {
    this.setState({model: new BAL()})
  }

  reset = () => {
    this.setState({
      ...this.initialState
    })
  }

  exportBAL = async () => {
    const {model} = this.state
    this.setState({loading: true})

    try {
      this.setState({
        downloadLink: getDownloadLink(await model.exportAsCsv()),
        error: null,
        loading: false
      })
    } catch (err) {
      this.setState({
        downloadLink: null,
        error: err,
        loading: false
      })
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
    const {model} = this.state

    await model.createCommune(newCommune.code, newCommune)
    const communes = await model.getCommunes()

    this.setState({communes})
  }

  addVoie = async newVoie => {
    const {model, commune} = this.state
    await model.createVoie(commune.code, newVoie)

    this.setState({commune: await model.getCommune(commune.code)})
  }

  addNumero = async newNumero => {
    const {model, commune, voie} = this.state
    await model.createNumero(commune.code, voie.codeVoie, newNumero)

    this.setState({voie: await model.getVoie(commune.code, voie.codeVoie)})
  }

  renameVoie = async (item, newName) => {
    const {commune} = this.state
    await this.state.model.renameVoie(commune.code, item.codeVoie, newName)
  }

  repositionVoie = async (item, position) => {
    const {commune} = this.state
    await this.state.model.repositionVoie(commune.code, item.codeVoie, position)
  }

  updateNumero = async (numero, modified) => {
    const {model, commune, voie} = this.state
    await model.updateNumero(commune.code, voie.codeVoie, numero.numeroComplet, modified)
    this.setState({numero})
  }

  deleteItem = async item => {
    const type = getType(item)

    if (type === 'commune') {
      this.deleteCommune(item)
    } else if (type === 'voie') {
      this.deleteVoie(item)
    } else {
      this.deleteNumero(item)
    }
  }

  deleteCommune = async commune => {
    const {model} = this.state
    await model.deleteCommune(commune.code)

    this.setState({
      communes: await model.getCommunes()
    })
  }

  deleteVoie = async voie => {
    const {model, commune} = this.state
    await model.deleteVoie(commune.code, voie.codeVoie)

    this.setState({
      voie: null
    })
  }

  deleteNumero = async numero => {
    const {model, commune, voie} = this.state

    await model.deleteNumero(commune.code, voie.codeVoie, numero.numeroComplet)

    const deletedNumero = await model.getNumero(commune.code, voie.codeVoie, numero.numeroComplet)

    if (this.state.numero && deletedNumero) {
      this.setState({
        numero: deletedNumero
      })
    } else {
      this.setState({
        numero: null
      })
    }
  }

  cancelChange = async item => {
    const {commune, voie, numero} = this.state
    const type = getType(item)

    if (type === 'commune') {
      await this.state.model.cancelCommuneChange(item.code)
    } else if (type === 'voie') {
      await this.state.model.cancelVoieChange(commune.code, item.codeVoie)
      this.setState({voie})
    } else {
      await this.state.model.cancelNumeroChange(commune.code, voie.codeVoie, item.numeroComplet)
      this.setState({numero})
    }
  }

  select = async (codeCommune, codeVoie, numeroComplet) => {
    const {model} = this.state
    const commune = await model.getCommune(codeCommune)
    const voie = await model.getVoie(codeCommune, codeVoie)
    const numero = await model.getNumero(codeCommune, codeVoie, numeroComplet)

    this.setState({
      commune,
      voie,
      numero
    })
  }

  render() {
    const {model, communes, commune, voie, numero, downloadLink, loading, error} = this.state
    const modelActions = {
      select: this.select,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      renameVoie: this.renameVoie,
      repositionVoie: this.repositionVoie,
      updateNumero: this.updateNumero,
      cancelChange: this.cancelChange
    }

    return (
      <div>
        {model ? (
          <EditBal
            communes={communes}
            commune={commune}
            voie={voie}
            numero={numero}
            actions={modelActions}
            downloadLink={downloadLink}
            filename='filename'
            loading={loading}
            error={error}
          />
        ) : (
          <div className='centered'>
            <Uploader
              newFile={this.createNewFile}
              onData={this.handleData}
            />
          </div>
        )}

        {model && (
          <div className='buttons'>
            {communes && (
              <Button onClick={this.exportBAL}>Exporter le fichier BAL</Button>
            )}
            <Button color='red' size='small' onClick={this.reset}>Tout annuler</Button>
          </div>
        )}

        <style jsx>{`
          .centered {
            display: flex;
            flex-direction: column;
            text-align: center;
          }

          .buttons {
            display: grid;
            grid-template-columns: 1fr;
            grid-row-gap: 0.5em;
            border: 1px solid ${theme.border};
            background-color: ${theme.colors.lighterGrey};
            margin: 2em 0;
            padding: 1em;
          }
        `}</style>
      </div>
    )
  }
}

export default Editor
