import PropTypes from 'prop-types'
import Image from 'next/image'
import {groupBy, sum, uniq} from 'lodash'
import {Award, Mail} from 'react-feather'

import {getDepartementByCode, getRegions} from '@/lib/api-geo'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import ButtonLink from '@/components/button-link'

import communes from 'data/partners/communes.json'
import Dropdown from '@/components/bases-locales/charte/dropdown'
import Commune from '@/components/bases-locales/charte/commune'

function Communes({regions}) {
  const title = 'Communes partenaires de la Charte'
  const description = 'Page vous permettant de consultez et découvrir les communes partenaires'

  // This sort can be removed when there is a sufficient number of partner communes.
  // Only two at the time this code was written…
  const sortByCommunesCount = regions.sort((a, b) => sum(b.departements.map(({communes}) => communes.length)) - sum(a.departements.map(({communes}) => communes.length)))

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Award size={56} alt aria-hidden='true' />} />

      <Section title='Liste des communes partenaires'>
        <div className='award-illustration'>
          <Image src='/images/icons/award.png' height={235} width={130} alt aria-hidden='true' />
        </div>
        <SectionText>
          Cette charte est à l’initiative de communes désireuses de <b>partager leur expérience</b>. La qualité de la Base Adresse Locale réalisée est un prérequis afin de faciliter <b>la diffusion de bonnes pratiques</b>.
          Votre commune ne fait pas partie de la liste ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.
        </SectionText>
        <div className='contact-button'>
          <ButtonLink href='mailto:adresse@data.gouv.fr' isExternal>
            Contactez-nous
            <Mail style={{verticalAlign: 'bottom', marginLeft: '4px'}} alt aria-hidden='true' />
          </ButtonLink>
        </div>

        <div className='region-container'>
          {sortByCommunesCount.map(({code, nom, departements}) => (
            <Dropdown
              key={code}
              code={code}
              nom={nom}
              communesCount={departements.length > 0 ? sum(departements.map(({communes}) => communes.length)) : 0}
            >
              {departements.length > 0 && departements.map(({code, nom, communes}) => (
                <Dropdown
                  key={code}
                  code={code}
                  nom={nom}
                  communesCount={communes.length}
                  size='small'
                  color='secondary'
                >
                  {communes.length > 0 && communes.map(commune => (
                    <Commune key={commune.codeCommune} {...commune} />
                  ))}
                </Dropdown>
              ))}
            </Dropdown>
          ))}
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

export async function getServerSideProps() {
  const regions = await getRegions()
  const communesByDepartement = groupBy(communes, ({codeDepartement}) => codeDepartement[0])

  return {
    props: {
      regions: await Promise.all(regions.map(async region => {
        const departementsCode = uniq(communes.filter(({codeRegion}) => codeRegion === region.code).map(({codeDepartement}) => codeDepartement[0]))

        return {
          ...region,
          departements: await Promise.all(departementsCode.map(async codeDepartement => {
            const departement = await getDepartementByCode(codeDepartement)

            return {
              ...departement,
              communes: communesByDepartement[codeDepartement]
            }
          }))
        }
      }))
    }
  }
}

Communes.propTypes = {
  regions: PropTypes.array.isRequired
}

export default Communes
