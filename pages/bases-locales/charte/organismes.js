import {useState} from 'react'
import {Award} from 'react-feather'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import Button from '@/components/button'
import Partners from '@/components/bases-locales/charte/partners'
import CandidacyModal from '@/components/bases-locales/charte/candidacy-modal'
import {getPartenairesDeLaCharte, getPartenairesDeLaCharteServices} from '@/lib/api-bal-admin'
import {getDepartements} from '@/lib/api-geo'
import PropTypes from 'prop-types'

function Organismes({organismePartners, partnersServices, departements}) {
  const title = 'Organismes partenaires de la Charte'
  const description = 'Page vous permettant de consultez et découvrir les organismes partenaires'

  const [showCandidacyModal, setShowCandidacyModal] = useState(false)

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Award size={56} alt='' aria-hidden='true' />} />

      <Section title='Liste des organismes partenaires'>
        <SectionText>
          Ces organismes s’engagent à respecter le format Base Adresse Locale (attention, il s’agit d’un format de données bien précis), sa gouvernance et pour ces raisons sont identifiés comme tiers de confiance.
          Votre organisme respecte déjà ces spécifications mais n’est pas identifié ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.
        </SectionText>
        <div className='contact-button'>
          <Button type='button' onClick={() => setShowCandidacyModal(true)}>
            Rejoignez-nous
          </Button>
        </div>

        <div className='partners-section'>
          <Partners data={organismePartners} />
        </div>
      </Section>
      {showCandidacyModal && <CandidacyModal
        onClose={() => setShowCandidacyModal(false)}
        partnersServices={partnersServices}
        departements={departements} />}

      <style jsx>{`
        .contact-button {
          text-align: center;
        }

        .partners-section {
          padding-top: 2em;
        }
      `}</style>
    </Page>
  )
}

export async function getServerSideProps() {
  const organismePartners = await getPartenairesDeLaCharte({type: 'organisme'})
  const partnersServices = await getPartenairesDeLaCharteServices()
  const departements = await getDepartements()

  return {
    props: {
      organismePartners,
      partnersServices,
      departements,
    }
  }
}

Organismes.propTypes = {
  partnersServices: PropTypes.array.isRequired,
  departements: PropTypes.array.isRequired,
  organismePartners: PropTypes.array.isRequired,
}

export default Organismes
