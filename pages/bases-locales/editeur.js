import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import FaEdit from 'react-icons/lib/fa/edit'
import {validate, extractAsTree} from '@etalab/bal'

import BALStorage from '../../lib/bal/storage'
import {extractCommunes} from '../../lib/bal/api'
import BAL from '../../lib/bal/model'
import {_get} from '../../lib/fetch'

import Page from '../../layouts/main'
import withErrors from '../../components/hoc/with-errors'

import Head from '../../components/head'
import LoadingContent from '../../components/loading-content'

import Editor from '../../components/bases-locales/editor'

const title = 'Créer ou modifier une Base Adresse Locale'

async function createBALStorage(codeCommune) {
  const csv = await extractCommunes([{code: codeCommune}])
  const report = await validate(csv)
  const tree = extractAsTree(report.normalizedRows, true)

  return new BAL(tree)
}

class EditorPage extends React.Component {
  state = {
    codeCommune: null,
    codeVoie: null,
    idNumero: null,
    loading: false,
    error: null
  }

  static propTypes = {
    id: PropTypes.string,
    model: PropTypes.object,
    codeCommune: PropTypes.string
  }

  static defaultProps = {
    id: null,
    model: null,
    codeCommune: null
  }

  static getInitialProps = async ({res, query}) => {
    const {id, codeCommune} = query
    const model = BALStorage.get(id)

    if (id && !model && !codeCommune) {
      res.redirect('/bases-locales/editeur')
    }

    return {id, model, codeCommune}
  }

  async componentDidMount() {
    const {id, codeCommune} = this.props

    if (!id && codeCommune) {
      await this.createModelFromCommune()

      this.setState({codeCommune})
    }
  }

  createModelFromCommune = async () => {
    const {codeCommune} = this.props

    this.setState({loading: true})

    try {
      await _get(`https://geo.api.gouv.fr/communes/${codeCommune}`) // Check if commune code exist
      const model = await createBALStorage(codeCommune)
      const href = `/bases-locales/editeur?id=${model._id}&codeCommune=${codeCommune}`
      const url = `/bases-locales/editeur/${model._id}/commune/${codeCommune}`

      BALStorage.set(model._id, model)

      Router.push(href, url)

      this.setState({
        loading: false
      })
    } catch (error) {
      this.setState({
        error,
        loading: false
      })
    }
  }

  updateModel = (codeCommune, codeVoie, idNumero) => {
    const {model} = this.props

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

    if (idNumero) {
      href += `&idNumero=${idNumero}`
      as += `/numero/${idNumero}`
    }

    Router.push(href, as, {shallow: true})

    this.setState({
      codeCommune,
      codeVoie,
      idNumero
    })
  }

  render() {
    const {codeCommune, codeVoie, idNumero, loading, error} = this.state
    const {model} = this.props

    return (
      <Page>
        <Head title={title} icon={<FaEdit />} />

        <LoadingContent loading={loading} error={error} centered>
          <Editor
            model={model}
            codeCommune={codeCommune}
            codeVoie={codeVoie}
            idNumero={idNumero}
            updateModel={this.updateModel}
          />
        </LoadingContent>

      </Page>
    )
  }
}

export default withErrors(EditorPage)
