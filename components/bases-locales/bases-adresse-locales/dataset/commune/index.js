import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import {deburr} from 'lodash'

import theme from '../../../../../styles/theme'

import Section from '../../../../section'

import Header from '../header'
import List from '../list'
import ProducerDiscussion from '../producer-discussion'

import Breadcrumb from './breadcrumb'
import CommunePreview from './commune-preview'

class Commune extends React.Component {
  static propTypes = {
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      organization: PropTypes.object.isRequired,
      page: PropTypes.string.isRequired
    }).isRequired,
    commune: PropTypes.shape({
      nom: PropTypes.string.isRequired,
      voies: PropTypes.array.isRequired
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  goto = codeVoie => {
    const {router} = this.props
    const {id, codeCommune} = router.query
    router.push(`/bases-locales/jeux-de-donnees/${id}/${codeCommune}/${codeVoie}`)
  }

  render() {
    const {dataset, commune} = this.props
    const {id, title, organization, page} = dataset

    return (
      <div>
        <Section>
          <Breadcrumb links={[{link: title, href: `/bases-locales/jeux-de-donnees/${id}`}]} current={commune.nom} />

          <Header
            name={commune.nom}
            logo={organization.logo} />

          <CommunePreview commune={commune} />

          <div className='list'>
            <h4>Liste des voies présentes dans le fichier</h4>
            <List
              list={commune.voies}
              filter={(voie, input) => deburr(voie.nomVoie.toLowerCase()).includes(input)}
              toItem={voie => {
                return {
                  id: voie.codeVoie,
                  name: voie.nomVoie,
                  link: this.goto,
                  info: {title: voie.numerosCount > 1 ? 'numéros' : 'numéro', value: voie.numerosCount}
                }
              }} />
          </div>
        </Section>

        <ProducerDiscussion page={page} />
        <style jsx>{`
          h4 {
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: 1em;
            margin-bottom: 0;
          }
        `}</style>
      </div>
    )
  }
}

export default withRouter(Commune)
