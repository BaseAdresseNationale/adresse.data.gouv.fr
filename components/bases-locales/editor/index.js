import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import BALStorage from '../../../lib/bal/storage'
import {getType} from '../../../lib/bal/item'
import theme from '../../../styles/theme'

import Section from '../../section'
import Button from '../../button'
import BAL from '../../../lib/bal/model'

import Uploader from './uploader'
import EditBal from './edit-bal'

function getDownloadLink(csvContent) {
  const blob = new Blob([csvContent], {type: 'text/csv'})
  return URL.createObjectURL(blob)
}

class Editor extends React.Component {
  initialState = {
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

    updateModel(cCommune, cVoie, numero.id)
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
    const {model, updateModel} = this.props

    let href = `/bases-locales/editeur?id=${model._id}`
    let as = `/bases-locales/editeur/${model._id}`

    if (codeCommune) {
      href += `&codeCommune=${codeCommune}`
      as += `/commune/${codeCommune}`
    }

    if (codeVoie) {
      href += `&codeVoie=${codeVoie}`
      as += `/voie/${codeVoie}`
    }

    if (numeroComplet) {
      href += `&idNumero=${numeroComplet}`
      as += `/numero/${numeroComplet}`
    }

    Router.push(href, as, {shallow: true})
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
    const {downloadLink, loading, error} = this.state
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

    return (
      <div>
        {model ? (
          <Section>
            <EditBal
              {...this.props}
              actions={modelActions}
              downloadLink={downloadLink}
              filename='filename'
              loading={loading}
              error={error}
            />
          </Section>
        ) : (
          <Uploader
            newFile={this.createNewFile}
            onData={this.handleData}
          />
        )}

        {model && (
          <Section>
            <div className='buttons'>
              {model.communes && (
                <Button onClick={this.exportBAL}>Exporter le fichier BAL</Button>
              )}
              <Button color='red' size='small' onClick={this.reset}>Tout annuler</Button>
            </div>
          </Section>
        )}

        <style jsx>{`
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
