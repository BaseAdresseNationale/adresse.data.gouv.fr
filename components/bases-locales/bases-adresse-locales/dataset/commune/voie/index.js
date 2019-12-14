import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../../../../section'

import Header from '../../header'
import ProducerDiscussion from '../../producer-discussion'

import Breadcrumb from '../breadcrumb'

import VoiePreview from './voie-preview'

class Voie extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    commune: PropTypes.object.isRequired,
    voie: PropTypes.object.isRequired
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
            logo={organization && organization.logo}
            info={{
              title: 'Dernière mise à jour',
              children: voie.dateMAJ ? voie.dateMAJ : 'inconnue'
            }}
            isPlaceName={voie.numerosCount === 0} />

          <VoiePreview voie={voie} />
        </Section>

        <ProducerDiscussion page={page} />
      </div>
    )
  }
}

export default Voie
