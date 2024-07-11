import {useState} from 'react'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import Partners from '@/components/bases-locales/charte/partners'
import CandidacyModal from '@/components/bases-locales/charte/candidacy-modal'
import {getPartenairesDeLaCharte, getPartenairesDeLaCharteServices} from '@/lib/api-bal-admin'
import {getDepartements} from '@/lib/api-geo'
import PropTypes from 'prop-types'

function Companies({companyPartners, partnersServices, departements}) {
  const title = 'Sociétés prestataires'
  const description = 'Page vous permettant de consultez et découvrir les organisations à but lucratif partenaires'

  const [showCandidacyModal, setShowCandidacyModal] = useState(false)

  return (
    <Page title={title} description={description}>
      <Head title={title} />

      <Section title='Liste des sociétés prestataires'>
        <SectionText>
          Les sociétés qui réalisent des prestations d’adressage s’engagent à respecter le
          {' '}
          <a
            href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/le-format-base-adresse-locale'
            target='_blank'
            rel='noreferrer'
          >
            format Base Adresse Locale
          </a>
          {' '}
          ainsi que les conditions requises aux
          {' '}
          <a
            href='https://doc.adresse.data.gouv.fr/mettre-a-jour-sa-base-adresse-locale/les-prestations-pour-la-realisation-dune-base-adresse-locale'
            target='_blank'
            rel='noreferrer'
          >
            prestations pour la réalisation d’une Base Adresse Locale
          </a>
          . En cas de non respects de ces conditions, nous nous réservons le droit de dé-
          référencé un prestataire
          <br />
          <br />
          Votre société souhaite figurer dans cette liste ? Contactez-nous à <i>adresse@data.gouv.fr</i>
        </SectionText>
        <div className='partners-section'>
          <Partners data={companyPartners} />
        </div>
      </Section>
      {showCandidacyModal && <CandidacyModal
        onClose={() => setShowCandidacyModal(false)}
        partnersServices={partnersServices}
        departements={departements}
      />}

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
  const companyPartners = await getPartenairesDeLaCharte({type: 'entreprise'})
  const partnersServices = await getPartenairesDeLaCharteServices()
  const departements = await getDepartements()

  return {
    props: {
      companyPartners,
      partnersServices,
      departements,
    }
  }
}

Companies.propTypes = {
  partnersServices: PropTypes.array.isRequired,
  departements: PropTypes.array.isRequired,
  companyPartners: PropTypes.array.isRequired,
}

export default Companies
