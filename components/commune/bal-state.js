import {useMemo, useState} from 'react'
import PropTypes from 'prop-types'
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
import Statistics from './statistics'

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
      <Statistics nbNumeros={nbNumeros} nbNumerosCertifies={nbNumerosCertifies} />

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

      <DownloadAdresses codeCommune={codeCommune} />

      <div className='contact-wrapper'>
        <h4>Contacter la commune</h4>

        <SectionText color='secondary'>
          En attendant, en cas de problème d’adresse sur une commune, voici comment la contacter. La commune est l’échelon de compétence pour mettre à jour les adresses et vous pouvez lui indiquer notre contact (<a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>) au besoin.
        </SectionText>
        <Button color='white' isOutlined onClick={handleModalOpen}>Contactez la mairie</Button>
        {isContactModalOpen && <ContactModal mairieInfos={mairieInfos} onModalClose={handleModalOpen} />}
      </div>

      <style jsx>{`
        .unaivalable-bal, .contact-wrapper {
          display: flex;
          flex-direction: column;
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

        h4 {
          margin: 2em 0 0 0;
          text-align: center;
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
