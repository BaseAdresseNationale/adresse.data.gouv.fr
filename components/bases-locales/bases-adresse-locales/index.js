import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Container from '@/components/container'
import Notification from '@/components/notification'

import BaseAdresseLocale from './base-adresse-locale'

class BasesAdresseLocales extends React.Component {
  static propTypes = {
    datasets: PropTypes.array.isRequired
  }

  render() {
    const {datasets} = this.props

    return (
      <>
        <Notification isFullWidth>
          <p>Cette page recense toutes les <strong>Bases Adresses Locales</strong> connues à ce jour.</p>
          <p>Pour référencer la vôtre facilement, publiez-la sur <a href='https://www.data.gouv.fr'>data.gouv.fr</a> avec le mot-clé <span className='tag'>base-adresse-locale</span>. Votre organisation devra auparavant avoir été <a href='https://doc.data.gouv.fr/organisations/certifier-une-organisation/'>certifiée</a>.<br />Vous pouvez aussi utiliser <a href='https://editeur.adresse.data.gouv.fr'>Mes Adresses</a>, qui dispose d’un outil de publication simplifié.</p>
        </Notification>
        <Container>
          <div className='bases'>
            {datasets.map(dataset => (
              <BaseAdresseLocale key={dataset.id} dataset={dataset} />
            ))}
          </div>
        </Container>

        <style jsx>{`
          .bases {
            display: grid;
            grid-row-gap: 2em;
            margin: 4em 0;
          }

          .tag {
            display: inline;
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: .2em .6em .3em;
            font-size: 75%;
            font-weight: 700;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: .25em;
          }
          `}</style>
      </>
    )
  }
}

export default BasesAdresseLocales
