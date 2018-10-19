import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import {flowRight} from 'lodash'
import FaEdit from 'react-icons/lib/fa/edit'

import BALStorage from '../../lib/bal/storage'

import Page from '../../layouts/main'
import withErrors from '../../components/hoc/with-errors'
import withWebGl from '../../components/hoc/with-web-gl'

import Loader from '../../components/loader'
import Head from '../../components/head'
import Section from '../../components/section'

const title = 'Éditer une fichier base locale'
const description = 'Cet outil permet de réaliser de vérifier la conformité d’un fichier BAL et d’en éditer les champs.'

const Editor = dynamic(import('../../components/bases-locales/editor'), {
  ssr: false,
  loading: () => (
    <div className='centered'>
      <Loader />
      <p>Chargement…</p>
      <style jsx>{`
          .centered {
             position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}</style>
    </div>
  )
})

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

      res.redirect('/bases-locales/editor')
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
        <Head title={title} icon={<FaEdit />}>
          {description}
        </Head>

        <Section>
          <Editor
            model={model}
            commune={commune}
            voie={voie}
            numero={numero}
          />
        </Section>
      </Page>
    )
  }
}

export default flowRight(
  withErrors,
  withWebGl
)(EditorPage)
