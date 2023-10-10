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
  console.log('🚀 ~ file: bal-state.js ~ line 18 ~ sanitedSources ~ adressesSources', adressesSources)
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

function BALState({communeInfos, mairieInfos, revision, typeComposition, hasMigratedBAL}) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const {codeCommune, nomCommune, nbNumeros, nbNumerosCertifies, voies} = communeInfos

  const adressesSources = uniq(voies.map(voie => voie.sources).flat())
  const userName = hasMigratedBAL && revision.context.organisation ? revision.context.organisation : `la mairie de ${nomCommune}`

  const subtitle = useMemo(() => {
    // Aucune BAL créée
    if (typeComposition === 'assemblage') {
      if (adressesSources.length > 0) {
        return `Les données sont actuellement construites à partir des sources historiques suivantes : ${sanitedSources(adressesSources)}`
      }

      return null
    }

    // BAL non disponible (en migration)
    if (!hasMigratedBAL) {
      return `Les adresses de la commune proviennent de la BAL de la commune de ${nomCommune} (source bientôt disponible)`
    }

    // BAL créée et migrée
    const clientName = revision.client.nom

    return `Les adresses de la commune proviennent de la Base Adresse Locale de ${userName}, via ${clientName}`
  }, [revision, userName, nomCommune, typeComposition, adressesSources, hasMigratedBAL])

  const handleModalOpen = () => {
    setIsContactModalOpen(!isContactModalOpen)
  }

  return (
    <Section title='État de la Base Adresse Nationale' background='color' subtitle={subtitle}>
      {nbNumeros > 0 && <Statistics nbNumeros={nbNumeros} nbNumerosCertifies={nbNumerosCertifies} />}

      {typeComposition === 'assemblage' && (
        <Notification type='warning'>
          <div className='unaivalable-bal'>
            <p>La commune ne dispose d’aucune Base Adresse Locale.</p>
            <ButtonLink
              isExternal
              size='large'
              target='_blank'
              rel='noreferrer'
              href={`https://mes-adresses.data.gouv.fr/new?commune=${codeCommune}`}
            >
              Créer votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} alt='' aria-hidden='true' />
            </ButtonLink>
          </div>
        </Notification>
      )}

      <DownloadAdresses codeCommune={codeCommune} nomCommune={nomCommune} />

      <div className='contact-wrapper'>
        <h4>Contacter la commune</h4>

        <SectionText color='secondary'>
          La commune est l’échelon de compétence pour mettre à jour les adresses. En cas de problème d’adresse sur la commune, voici comment la contacter. Vous pouvez également lui indiquer notre contact (<a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>) au besoin.

        </SectionText>
        <Button color='white' isOutlined disabled={!mairieInfos} onClick={handleModalOpen}>Contactez la mairie</Button>
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
  mairieInfos: PropTypes.object,
  typeComposition: PropTypes.string.isRequired,
  hasMigratedBAL: PropTypes.bool.isRequired,
  revision: PropTypes.object
}

BALState.defaultType = {
  revision: null,
  mairieInfos: null
}

export default BALState
