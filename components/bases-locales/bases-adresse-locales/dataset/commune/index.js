import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../../../section'

import Header from '../header'
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
    commune: PropTypes.object.isRequired
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
            logo={organization.logo}
            info={{
              title: 'Dernière mise à jour',
              children: commune.dateMAJ ? commune.dateMAJ : 'inconnue'}} />

          <CommunePreview commune={commune} />
        </Section>

        <ProducerDiscussion page={page} />
      </div>
    )
  }
}

export default Commune
