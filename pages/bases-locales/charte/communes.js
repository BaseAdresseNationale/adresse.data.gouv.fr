import PropTypes from 'prop-types'
import Image from 'next/image'
import {Award, Mail} from 'react-feather'

import {getRegion} from '@/lib/api-geo'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'
import Region from '@/components/bases-locales/charte/region'

import partners from 'partners.json'
function Communes({regions}) {
  const title = 'Communes partenaires de la Charte'
  const description = 'Page vous permettant de consultez et découvrir les communes partenaires'

  // Trier par ordre alphabétique en incluant les accents
  const orderedRegions = [...regions].sort((a, b) => a.nom.localeCompare(b.nom))

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Award size={56} />} />

      <Section title='Liste des communes partenaires'>
        <div className='award-illustration'>
          <Image src='/images/icons/award.png' height={235} width={130} />
        </div>
        <SectionText>
          Cette charte est à l’initiative de communes désireuses de <b>partager leur expérience</b>. La qualité de la Base Adresse Locale réalisée est un prérequis afin de faciliter <b>la diffusion de bonnes pratiques</b>.
          Votre commune ne fait pas partie de la liste ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.
        </SectionText>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} />
          </ButtonLink>
        </div>

        <div className='region-container'>
          {orderedRegions.map(region => <Region key={region.code} {...region} communes={partners.communes} />)}
        </div>
      </Section>

      <style jsx>{`
        .award-illustration, .contact-button {
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

Communes.getInitialProps = async () => {
  return {
    regions: await getRegion()
  }
}

Communes.propTypes = {
  regions: PropTypes.array.isRequired
}

export default Communes
