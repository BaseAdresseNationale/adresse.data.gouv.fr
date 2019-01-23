import 'regenerator-runtime/runtime' // eslint-disable-line import/no-unassigned-import
import React from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import FaEdit from 'react-icons/lib/fa/edit'
import {validate, extractAsTree} from '@etalab/bal'

import BALStorage from '../../lib/bal/storage'
import {extractCommunes} from '../../lib/bal/api'
import BAL from '../../lib/bal/model'

import Page from '../../layouts/main'
import withErrors from '../../components/hoc/with-errors'

import Head from '../../components/head'
import LoadingContent from '../../components/loading-content'

import Editor from '../../components/bases-locales/editor'

const title = 'Créer ou modifier une Base Adresse Locale'

const createBALStorage = async codeCommune => {
  try {
    const csv = await extractCommunes([{code: codeCommune}])
    const report = await validate(csv)
    const tree = extractAsTree(report.normalizedRows, true)

    return new BAL(tree)
  } catch (error) {
    throw new Error(error)
  }
}

class EditorPage extends React.Component {
  state = {
    loading: false,
    error: null
  }

  static propTypes = {
    codeCommune: PropTypes.string,
    model: PropTypes.object,
    commune: PropTypes.object,
    voie: PropTypes.object,
    numero: PropTypes.object
  }

  static defaultProps = {
    codeCommune: null,
    model: null,
    commune: null,
    voie: null,
    numero: null
  }

  static getInitialProps = async ({res, query}) => {
    const {id, codeCommune, codeVoie, idNumero} = query

    if (!id && codeCommune) {
      return {
        codeCommune
      }
    }

    if (id) {
      const model = BALStorage.get(id)

      if (model) {
        return {
          model,
          commune: codeCommune ? await model.getCommune(codeCommune) : null,
          voie: codeVoie ? await model.getVoie(codeCommune, codeVoie) : null,
          numero: idNumero ? await model.getNumero(codeCommune, codeVoie, idNumero) : null
        }
      }

      res.redirect('/bases-locales/editeur')
    }

    return {
      model: null,
      commune: null,
      voie: null,
      nuemro: null
    }
  }

  async componentDidMount() {
    const {codeCommune} = this.props

    if (codeCommune) {
      this.setState({loading: true})

      try {
        const model = await createBALStorage(codeCommune)
        const commune = await model.getCommune(codeCommune)

        if (commune) {
          const href = `/bases-locales/editeur?id=${model._id}&codeCommune=${codeCommune}`
          const url = `/bases-locales/editeur/${model._id}/commune/${codeCommune}`

          BALStorage.set(model._id, model)

          Router.push(href, url)

          this.setState({
            loading: false
          })
        } else {
          throw new Error('codeCommune error')
        }
      } catch (error) {
        this.setState({
          error,
          loading: false
        })
      }
    }
  }

  render() {
    const {loading, error} = this.state
    const {model, commune, voie, numero} = this.props

    return (
      <Page>
        <Head title={title} icon={<FaEdit />} />

        <LoadingContent loading={loading} error={error} centered>
          <Editor
            model={model}
            commune={commune}
            voie={voie}
            numero={numero}
          />
        </LoadingContent>

      </Page>
    )
  }
}

export default withErrors(EditorPage)
