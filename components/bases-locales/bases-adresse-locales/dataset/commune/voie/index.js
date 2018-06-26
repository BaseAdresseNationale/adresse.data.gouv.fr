import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../../../../section'

import Header from '../../header'
import ProducerDiscussion from '../../producer-discussion'

import Breadcrumb from '../breadcrumb'

import VoiePreview from './voie-preview'

class Voie extends React.Component {
  static propTypes = {
    dataset: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      organization: PropTypes.object.isRequired,
      page: PropTypes.string.isRequired
    }).isRequired,
    commune: PropTypes.shape({
      code: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired
    }),
    voie: PropTypes.shape({
      nomVoie: PropTypes.string.isRequired
    }).isRequired
  }

  render() {
    const {dataset, commune, voie} = this.props
    const {id, title, organization, page} = dataset

    return (
      <div>
        <Section>
          <Breadcrumb
            links={[
              {link: title, href: `/bases-locales/jeux-de-donnees/${id}`},
              {link: commune.nom, href: `/bases-locales/jeux-de-donnees/${id}/${commune.code}`}
            ]}
            current={voie.nomVoie} />

          <Header
            name={voie.nomVoie}
            logo={organization.logo}
            info={{
              title: 'Dernière mise à jour',
              children: dataset.lastUpdate ? dataset.lastUpdate : 'inconnue'
            }} />

          <VoiePreview voie={voie} />
        </Section>

        <ProducerDiscussion page={page} />
      </div>
    )
  }
}

export default Voie
