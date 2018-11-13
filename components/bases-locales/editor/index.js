// eslint-disable-next-line import/no-unassigned-import
// import 'regenerator-runtime/runtime'
import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'

import BALStorage from '../../../lib/bal/storage'
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
    downloadLink: null,
    loading: false,
    error: null
  }

  state = {
    ...this.initialState
  }

  static propTypes = {
    model: PropTypes.object,
    commune: PropTypes.object,
    voie: PropTypes.object,
    numero: PropTypes.object
  }

  static defaultProps = {
    model: null,
    commune: null,
    voie: null,
    numero: null
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
  }

  addCommune = async newCommune => {
    const {model} = this.props
    await model.createCommune(newCommune.code, newCommune)

    const href = `/bases-locales/editeur?id=${model._id}`
    const as = `/bases-locales/editeur/${model._id}`

    Router.push(href, as)
  }

  addVoie = async newVoie => {
    const {model, commune} = this.props
    await model.createVoie(commune.code, newVoie)

    const href = `/bases-locales/editeur?id=${model._id}&codeCommune=${commune.code}`
    const as = `/bases-locales/editeur/${model._id}/commune/${commune.code}`

    Router.push(href, as)
  }

  addNumero = async newNumero => {
    const {model, commune, voie} = this.props
    await model.createNumero(commune.code, voie.codeVoie, newNumero)

    const href = `/bases-locales/editeur?id=${model._id}&codeCommune=${commune.code}&codeVoie=${voie.codeVoie}`
    const as = `/bases-locales/editeur/${model._id}/commune/${commune.code}/voie/${voie.codeVoie}`

    Router.push(href, as)
  }

  renameVoie = async (item, newName) => {
    const {model, commune} = this.props
    await model.renameVoie(commune.code, item.codeVoie, newName)
  }

  repositionVoie = async (item, position) => {
    const {model, commune} = this.props
    await model.repositionVoie(commune.code, item.codeVoie, position)
  }

  updateNumero = async (numero, modified) => {
    const {model, commune, voie} = this.props
    await model.updateNumero(commune.code, voie.codeVoie, numero.numeroComplet, modified)

    const href = `/bases-locales/editeur?id=${model._id}&codeCommune=${commune.code}&codeVoie=${voie.codeVoie}&idNumero=${numero.numeroComplet}`
    const as = `/bases-locales/editeur/${model._id}/commune/${commune.code}/voie/${voie.codeVoie}/numero/${numero.numeroComplet}`

    Router.push(href, as)
  }

  deleteItem = (item, scrollTop = false) => {
    const type = getType(item)

    if (type === 'commune') {
      this.deleteCommune(item)
    } else if (type === 'voie') {
      this.deleteVoie(item)
    } else {
      this.deleteNumero(item)
    }

    if (scrollTop) {
      this.scrollTop()
    }
  }

  deleteCommune = async commune => {
    const {model} = this.props
    await model.deleteCommune(commune.code)

    const href = `/bases-locales/editeur?id=${model._id}`
    const as = `/bases-locales/editeur/${model._id}`

    Router.push(href, as)
  }

  deleteVoie = async voie => {
    const {model, commune} = this.props
    await model.deleteVoie(commune.code, voie.codeVoie)

    const href = `/bases-locales/editeur?id=${model._id}&codeCommune=${commune.code}`
    const as = `/bases-locales/editeur/${model._id}/commune/${commune.code}`

    Router.push(href, as)
  }

  deleteNumero = async numero => {
    const {model, commune, voie} = this.props
    let href = `/bases-locales/editeur?id=${model._id}&codeCommune=${commune.code}&codeVoie=${voie.codeVoie}`
    let as = `/bases-locales/editeur/${model._id}/commune/${commune.code}/voie/${voie.codeVoie}`

    await model.deleteNumero(commune.code, voie.codeVoie, numero.numeroComplet)

    const deletedNumero = await model.getNumero(commune.code, voie.codeVoie, numero.numeroComplet)

    if (this.props.numero && deletedNumero) {
      href += `&idNumero=${numero.numeroComplet}`
      as += `/numero/${numero.numeroComplet}`
    }

    Router.push(href, as)
  }

  cancelChange = async item => {
    const {model, commune, voie, numero} = this.props
    const type = getType(item)
    let href = `/bases-locales/editeur?id=${model._id}&codeCommune=${commune.code}`
    let as = `/bases-locales/editeur/${model._id}/commune/${commune.code}`

    if (type === 'commune') {
      await model.cancelCommuneChange(item.code)
    } else if (type === 'voie') {
      await model.cancelVoieChange(commune.code, item.codeVoie)
      href += `&codeVoie=${voie.codeVoie}`
      as += `/voie/${voie.codeVoie}`
    } else {
      await model.cancelNumeroChange(commune.code, voie.codeVoie, item.numeroComplet)
    }

    if (numero) {
      href += `&codeVoie=${voie.codeVoie}&idNumero=${item.numeroComplet}`
      as += `/voie/${voie.codeVoie}/numero/${item.numeroComplet}`
    }

    Router.push(href, as)
  }

  select = async (codeCommune, codeVoie, numeroComplet) => {
    const {model} = this.props
    const commune = await model.getCommune(codeCommune)
    const voie = await model.getVoie(codeCommune, codeVoie)
    const numero = await model.getNumero(codeCommune, codeVoie, numeroComplet)

    let href = `/bases-locales/editeur?id=${model._id}`
    let as = `/bases-locales/editeur/${model._id}`

    if (commune) {
      href += `&codeCommune=${commune.code}`
      as += `/commune/${codeCommune}`
    }

    if (voie) {
      href += `&codeVoie=${voie.codeVoie}`
      as += `/voie/${voie.codeVoie}`
    }

    if (numero) {
      href += `&idNumero=${numero.numeroComplet}`
      as += `/numero/${numero.numeroComplet}`
    }

    Router.push(href, as)

    this.scrollTop()
  }

  scrollTop = () => {
    window.scrollTo(0, 270)
  }

  render() {
    const {downloadLink, loading, error} = this.state
    const {commune, voie, numero, model} = this.props
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
              communes={model.communes}
              commune={commune}
              voie={voie}
              numero={numero}
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
