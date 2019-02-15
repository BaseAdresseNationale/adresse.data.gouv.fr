import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import BALStorage from '../../../lib/bal/storage'
import {getType} from '../../../lib/bal/item'
import BAL from '../../../lib/bal/model'

import Section from '../../section'

import Uploader from './uploader'
import EditBal from './edit-bal'
import ExportControls from './edit-bal/export-controls'
import Communes from './edit-bal/context/communes'

function getDownloadLink(csvContent) {
  const blob = new Blob([csvContent], {type: 'text/csv'})
  return URL.createObjectURL(blob)
}

class Editor extends React.Component {
  initialState = {
    commune: null,
    downloadLink: null,
    loading: false,
    error: null
  }

  state = {
    ...this.initialState
  }

  static propTypes = {
    model: PropTypes.object,
    codeCommune: PropTypes.string,
    codeVoie: PropTypes.string,
    idNumero: PropTypes.string,
    updateModel: PropTypes.func.isRequired
  }

  static defaultProps = {
    model: null,
    codeCommune: null,
    codeVoie: null,
    idNumero: null
  }

  async componentDidUpdate(prevProps) {
    const {model, codeCommune} = this.props

    if (codeCommune !== prevProps.codeCommune) {
      const commune = await model.getCommune(codeCommune)
      this.setState({commune})
    }
  }

  handleData = tree => {
    const model = new BAL(tree)
    BALStorage.set(model._id, model)

    const href = `/bases-locales/editeur?id=${model._id}`
    const as = `/bases-locales/editeur/${model._id}`

    Router.push(href, as)
  }

  createNewFile = () => {
    const model = new BAL()
    BALStorage.set(model._id, model)

    const href = `/bases-locales/editeur?id=${model._id}`
    const as = `/bases-locales/editeur/${model._id}`

    Router.push(href, as)
  }

  reset = () => {
    this.setState({
      ...this.initialState
    })

    Router.push('/bases-locales/editeur')
  }

  exportBAL = async () => {
    const {model} = this.props
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

    this.refreshModel()
  }

  addCommune = async newCommune => {
    const {model} = this.props
    await model.createCommune(newCommune.code, newCommune)
  }

  addVoie = async newVoie => {
    const {model, codeCommune} = this.props
    await model.createVoie(codeCommune, newVoie)
  }

  addNumero = async newNumero => {
    const {model, codeCommune, codeVoie} = this.props

    await model.createNumero(
      newNumero.codeCommune || codeCommune,
      newNumero.codeVoie || codeVoie,
      newNumero
    )
  }

  renameVoie = async (item, newName) => {
    const {model, codeCommune} = this.props
    await model.renameVoie(codeCommune, item.codeVoie, newName)

    this.refreshModel()
  }

  repositionVoie = async (item, position) => {
    const {model, codeCommune} = this.props
    await model.repositionVoie(codeCommune, item.codeVoie, position)

    this.refreshModel()
  }

  updateNumero = async (numero, modified) => {
    const {model, codeCommune, codeVoie} = this.props
    await model.updateNumero(codeCommune, codeVoie, numero.numeroComplet, modified)

    this.refreshModel()
  }

  deleteItem = async (item, scrollTop = false) => {
    const type = getType(item)

    if (type === 'commune') {
      await this.deleteCommune(item)
    } else if (type === 'voie') {
      await this.deleteVoie(item)
    } else {
      await this.deleteNumero(item)
    }

    if (scrollTop) {
      this.scrollTop()
    }
  }

  deleteCommune = async commune => {
    const {model} = this.props
    await model.deleteCommune(commune.code)

    this.refreshModel()
  }

  deleteVoie = async voie => {
    const {model, codeCommune, updateModel} = this.props
    await model.deleteVoie(codeCommune, voie.codeVoie)

    updateModel(codeCommune)
  }

  deleteNumero = async numero => {
    const {model, codeCommune, codeVoie, updateModel} = this.props
    const cCommune = numero.codeCommune || codeCommune
    const cVoie = numero.codeVoie || codeVoie

    await model.deleteNumero(cCommune, cVoie, numero.numeroComplet)

    updateModel(codeCommune, codeVoie)
  }

  cancelChange = async item => {
    const {model, codeCommune, codeVoie} = this.props
    const type = getType(item)

    if (type === 'commune') {
      await model.cancelCommuneChange(item.code)
    } else if (type === 'voie') {
      await model.cancelVoieChange(codeCommune, item.codeVoie)
    } else {
      await model.cancelNumeroChange(codeCommune, codeVoie, item.numeroComplet)
    }

    this.refreshModel()
  }

  select = async (codeCommune, codeVoie, numeroComplet) => {
    const {updateModel} = this.props

    this.scrollTop()

    updateModel(codeCommune, codeVoie, numeroComplet)
  }

  scrollTop = () => {
    window.scrollTo(0, 200)
  }

  refreshModel() {
    const {codeCommune, codeVoie, idNumero, updateModel} = this.props
    updateModel(codeCommune, codeVoie, idNumero)
  }

  render() {
    const {commune, downloadLink, loading, error} = this.state
    const {model} = this.props
    const modelActions = {
      select: this.select,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      renameVoie: this.renameVoie,
      repositionVoie: this.repositionVoie,
      updateNumero: this.updateNumero,
      cancelChange: this.cancelChange
    }

    const exportControls = (
      <ExportControls
        downloadLink={downloadLink}
        filename='filename'
        loading={loading}
        error={error}
        exportBAL={this.exportBAL}
        reset={this.reset}
      />
    )

    return (
      <div>
        {model ? (
          <>
            {commune ? (
              <EditBal
                {...this.props}
                commune={commune}
                exportControls={exportControls}
                actions={modelActions}
              />
            ) : (
              <Section>
                <Communes
                  communes={model.communes}
                  actions={modelActions}
                />

                {exportControls}
              </Section>
            )}
          </>
        ) : (
          <Uploader
            newFile={this.createNewFile}
            onData={this.handleData}
          />
        )}
      </div>
    )
  }
}

export default Editor
