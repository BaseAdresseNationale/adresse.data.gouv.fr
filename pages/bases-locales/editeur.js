import React from 'react'
import PropTypes from 'prop-types'
import FaEdit from 'react-icons/lib/fa/edit'

import BALStorage from '../../lib/bal/storage'

import Page from '../../layouts/main'
import withErrors from '../../components/hoc/with-errors'

import Head from '../../components/head'

import Editor from '../../components/bases-locales/editor'

const title = 'Créer ou modifier une Base Adresse Locale'

class EditorPage extends React.Component {
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

  static getInitialProps = async ({res, query}) => {
    if (query.id) {
      const model = BALStorage.get(query.id)

      if (model) {
        return {
          model,
          commune: query.codeCommune ? await model.getCommune(query.codeCommune) : null,
          voie: query.codeVoie ? await model.getVoie(query.codeCommune, query.codeVoie) : null,
          numero: query.idNumero ? await model.getNumero(query.codeCommune, query.codeVoie, query.idNumero) : null
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

  render() {
    const {model, commune, voie, numero} = this.props

    return (
      <Page>
        <Head title={title} icon={<FaEdit />} />

        <Editor
          model={model}
          commune={commune}
          voie={voie}
          numero={numero}
        />
      </Page>
    )
  }
}

export default withErrors(EditorPage)
