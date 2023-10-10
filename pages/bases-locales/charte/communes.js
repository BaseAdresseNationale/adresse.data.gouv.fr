import {useState} from 'react'
import PropTypes from 'prop-types'
import Image from 'next/legacy/image'
import {groupBy, sum, uniq} from 'lodash'
import {Award} from 'react-feather'

import {getDepartementByCode, getRegions, getDepartements} from '@/lib/api-geo'

import Page from '@/layouts/main'
import {getPartenairesDeLaCharte, getPartenairesDeLaCharteServices} from '@/lib/api-bal-admin'

import Head from '@/components/head'
import Section from '@/components/section'
import SectionText from '@/components/section-text'
import Button from '@/components/button'

import Dropdown from '@/components/bases-locales/charte/dropdown'
import Commune from '@/components/bases-locales/charte/commune'
import CandidacyModal from '@/components/bases-locales/charte/candidacy-modal'

function Communes({regions, partnersServices, departements}) {
  const title = 'Communes partenaires de la Charte'
  const description = 'Page vous permettant de consultez et découvrir les communes partenaires'

  const [showCandidacyModal, setShowCandidacyModal] = useState(false)

  // This sort can be removed when there is a sufficient number of partner communes.
  // Only two at the time this code was written…
  const sortByCommunesCount = regions.sort((a, b) => sum(b.departements.map(({communes}) => communes.length)) - sum(a.departements.map(({communes}) => communes.length)))

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<Award size={56} alt='' aria-hidden='true' />} />

      <Section title='Liste des communes partenaires'>
        <div className='award-illustration'>
          <Image src='/images/icons/award.png' height={235} width={130} alt='' aria-hidden='true' />
        </div>
        <SectionText>
          Cette charte est à l’initiative de communes désireuses de <b>partager leur expérience</b>. La qualité de la Base Adresse Locale réalisée est un prérequis afin de faciliter <b>la diffusion de bonnes pratiques</b>.
          Votre commune ne fait pas partie de la liste ? Vous pouvez rejoindre les partenaires de la Charte en nous contactant.
        </SectionText>
        <div className='contact-button'>
          <Button onClick={() => setShowCandidacyModal(true)} >
            Rejoignez-nous
          </Button>
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
      {showCandidacyModal && <CandidacyModal
        partnersServices={partnersServices}
        departements={departements}
        onClose={() => setShowCandidacyModal(false)} />}

      <style jsx>{`
        .award-illustration, .contact-button {
          text-align: center;
        }
        .contact-button {
          margin-bottom: 2em;
        }
      `}</style>
    </Page>
  )
}

export async function getServerSideProps() {
  const regions = await getRegions()
  const communesPartners = await getPartenairesDeLaCharte({type: 'commune'})
  const partnersServices = await getPartenairesDeLaCharteServices()
  const departements = await getDepartements()
  const communesByDepartement = groupBy(communesPartners, ({codeDepartement}) => codeDepartement[0])

  return {
    props: {
      regions: await Promise.all(regions.map(async region => {
        const departementsCode = uniq(communesPartners.filter(({codeRegion, codeDepartement}) => {
          return codeRegion === region.code && codeDepartement && codeDepartement.length > 0
        }).map(({codeDepartement}) => codeDepartement[0]))

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
      })),
      partnersServices,
      departements,
    }
  }
}

Communes.propTypes = {
  regions: PropTypes.array.isRequired,
  partnersServices: PropTypes.array.isRequired,
  departements: PropTypes.array.isRequired,
}

export default Communes
