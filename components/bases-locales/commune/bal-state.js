import {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
import {Doughnut} from 'react-chartjs-2'
import {uniq} from 'lodash'
import {Edit2} from 'react-feather'

import theme from '@/styles/theme'

import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ContactModal from './contact-modal'
import Button from '@/components/button'
import DownloadAdresses from './download-adresses'
import Notification from '@/components/notification'
import ButtonLink from '@/components/button-link'

function toCounterData(percent, total) {
  return {
    labels: [],
    datasets: [
      {
        data: [percent, total],
        backgroundColor: [
          '#0054B3',
          '#FCB955'
        ],
        borderColor: [
          '#FFFFFF',
        ],
        borderWidth: 3,
      },
    ]
  }
}

const options = {
  height: 50,
  width: 50,
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false
    }
  }
}

function sanitedSources(adressesSources) {
  const sources =
    {
      cadastre: 'cadastre',
      ftth: 'opérateurs THD',
      'insee-ril': 'INSEE',
      'ign-api-gestion-ign': 'IGN',
      'ign-api-gestion-laposte': 'La Poste',
      'ign-api-gestion-municipal_administration': 'Guichet Adresse',
      'ign-api-gestion-sdis': 'SDIS'
    }

  const sanitizedNames = []
  adressesSources.forEach(adressesSource => {
    for (const [key, value] of Object.entries(sources)) {
      if (key === adressesSource) {
        sanitizedNames.push(value)
      }
    }
  })

  return sanitizedNames.slice(0, -1).join(', ') + ' et ' + sanitizedNames.slice(-1)
}

function BALState({communeInfos, mairieInfos, revision, typeComposition}) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const {codeCommune, nomCommune, nbNumeros, nbNumerosCertifies, voies} = communeInfos

  const certifiedPercent = (nbNumerosCertifies / nbNumeros) * 100
  const doughnutData = toCounterData(Math.round(certifiedPercent), 100 - Math.round(certifiedPercent))

  const adressesSources = uniq(voies.map(voie => voie.sources).flat())
  let userName = revision && (revision.context.nomComplet || revision.context.organisation)

  if (revision && !userName) {
    if (revision.habilitation.strategy.type === 'email') {
      userName = `la mairie de ${nomCommune}`
    } else if (revision.habilitation.strategy.type === 'franceconnect') {
      userName = `l'élu(e) de ${nomCommune}`
    }
  }

  const subtitle = useMemo(() => {
    if (typeComposition === 'transitory') {
      return `Les adresses de la commune proviennent de la BAL de la commune de ${nomCommune} (bientôt disponible)`
    }

    if (typeComposition === 'assemblage') {
      return `Les données sont actuellement construites à partir des sources historiques suivantes : ${sanitedSources(adressesSources)}`
    }

    const clientName = revision.client.nom

    if (userName && clientName) {
      return `Les adresses de la commune proviennent de la Base Adresse Locale de ${userName}, via ${clientName}`
    }

    if (userName && !clientName) {
      return `Les adresses de la commune proviennent de la Base Adresse Locale de ${userName}`
    }
  }, [revision, userName, nomCommune, typeComposition, adressesSources])

  const handleModalOpen = () => {
    setIsContactModalOpen(!isContactModalOpen)
  }

  return (
    <Section title='État de la Base Adresse Nationale' background='color' subtitle={subtitle}>
      <div className='bal-state-wrapper'>
        <div className='statistiques-container'>
          <div className='bal-states-container'>
            <div className='doughnut'>
              <Doughnut data={doughnutData} options={options} />
            </div>
            <div className='numbers'>
              <div className='addresses-number'>
                <div className='certified-number'>{nbNumerosCertifies}</div>
                adresses certifiées.
              </div>
              <div className='addresses-number'>
                <div className='uncertified-number'>{nbNumeros - nbNumerosCertifies}</div>
                adresses non certifiées (ou en attente).
              </div>
            </div>
          </div>
          <p className='percent'>Aujourd’hui, <b>{certifiedPercent.toFixed(2)} %</b> de la totalité des adresses de la commune sont certifiées.</p>
        </div>
      </div>

      {typeComposition === 'assemblage' && (
        <Notification type='warning'>
          <div className='unaivalable-bal'>
            <p>La commune de Beauvoir-sur-Mer ne dispose d’aucune Base Adresse Locale.</p>
            <ButtonLink
              isExternal
              size='large'
              target='_blank'
              rel='noreferrer'
              href='https://mes-adresses.data.gouv.fr/new'
            >
              Créer votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} />
            </ButtonLink>
          </div>
        </Notification>
      )}

      <DownloadAdresses typeComposition={typeComposition} revision={revision} codeCommune={codeCommune} />

      <div className='contact-wrapper'>
        <SectionText color='secondary'>
          Il n’existe pas encore de dispositif national permettant aux citoyens de contribuer directement à la Base Adresse Locale, mais de <b>nombreux guichets de signalement</b> existent à l’échelon local. Ce site a vocation à les référencer à moyen terme. En attendant, <b>contactez votre mairie</b> et parlez-leur de nous !
        </SectionText>
        <Button color='white' isOutlined onClick={handleModalOpen}>Contactez la mairie</Button>
        {isContactModalOpen && <ContactModal mairieInfos={mairieInfos} onModalClose={handleModalOpen} />}
      </div>

      <style jsx>{`
        .bal-state-wrapper {
          margin: 3em 0;
        }

        .statistiques-container, .numbers, .addresses-number, .unaivalable-bal, .contact-wrapper {
          display: flex;
          flex-direction: column;
        }

        .statistiques-container {
          text-align: center;
          background: ${theme.colors.white};
          color: ${theme.darkText};
          border-radius: 8px;
          padding: 2em;
          gap: 1em;
        }

        .bal-states-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-items: center;
          gap: 2em;
        }

        .doughnut {
          max-width: 250px;
        }

        .numbers {
          min-width: 250px;
          gap: 2em;
          font-weight: bold;
          font-size: x-large;
        }

        .addresses-number {
          gap: 1em;
        }

        .certified-number, .uncertified-number {
          font-size: xxx-large;
        }

        .certified-number {
          color: ${theme.primary};
        }

        .uncertified-number {
          color: #FCB955;
        }

        .percent {
          font-size: x-large;
          margin: 0;
          padding-top: 1em;
          border-top: solid 3px ${theme.border};
        }

        .percent b {
          color: ${theme.primary};
        }

        .unaivalable-bal {
          align-items: center;
          gap: 1em;
        }

        .unaivalable-bal p {
          font-size: 18px;
          color: ${theme.colors.orange};
          font-weight: bold;
          text-align: center;
        }

        .contact-wrapper {
          align-items: center;
        }

        .contact {
          display: flex;
          gap: 10px;
          margin: 1em 0;
        }
      `}</style>
    </Section>
  )
}

BALState.propTypes = {
  communeInfos: PropTypes.object.isRequired,
  mairieInfos: PropTypes.object.isRequired,
  typeComposition: PropTypes.string.isRequired,
  revision: PropTypes.object
}

BALState.defaultType = {
  revision: null
}

export default BALState
