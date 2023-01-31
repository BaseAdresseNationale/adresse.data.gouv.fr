import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {sortBy, debounce, pick} from 'lodash'

import {Database} from 'react-feather'

import {getFantoir} from '@/lib/api-ban'
import {getDepartementByCode} from '@/lib/api-geo'

import Page from '@/layouts/main'
import withErrors from '@/components/hoc/with-errors'
import Head from '@/components/head'
import Section from '@/components/section'
import SearchBar from '@/components/search-bar'
import HeaderListFantoir from '@/components/fantoir/header-list-fantoir'
import BodyListFantoir from '@/components/fantoir/body-list-fantoir'

const communeHeader = ['Commune', 'Code INSEE', 'Annulée ?']
const communeInfos = ['nomCommune', 'codeCommune', 'dateAnnulation']

function CommunesList({communes, nomDepartement}) {
  const router = useRouter()
  const sortedCommunes = useMemo(() => {
    return sortBy(communes, ['id'])
  }, [communes])

  const [results, setResults] = useState(sortedCommunes)

  const searchCommunes = debounce(value => {
    const foundCommunes = sortedCommunes.filter(c => c.nomCommune.toLowerCase().includes(value.toLowerCase()))

    setResults(foundCommunes)
  }, 300)

  return (
    <Page title='FANTOIR'>
      <Head title={`FANTOIR : ${nomDepartement}`} icon={<Database size={56} alt='' aria-hidden='true' />} />
      <Section title={`Liste des communes - ${nomDepartement}`}>
        <div className='search'>
          <SearchBar
            placeholder='Chercher une commune'
            onChange={e => searchCommunes(e.target.value)}
          />
        </div>

        <HeaderListFantoir
          headers={communeHeader}
        />

        {results.length > 0 ? (
          results.map(commune => {
            const formatedCommune = pick(commune, communeInfos)

            if (!formatedCommune.dateAnnulation) {
              formatedCommune.dateAnnulation = 'non'
            }

            return (
              <BodyListFantoir
                key={commune.id}
                contents={Object.values(formatedCommune)}
                isCanceled={formatedCommune.dateAnnulation && formatedCommune.dateAnnulation !== 'non'}
                onSelect={() => router.push(`/fantoir/departement/${commune.codeDepartement}/commune/${commune.codeCommune}`)}
              />
            )
          })
        ) : (
          <div className='no-result'>
            <i>Aucun résultat</i>
          </div>
        )}
      </Section>
      <style jsx>{`
        .search {
          padding: 1em 0;
        }

        .no-result {
          padding: 1em;
          font-size: 1.2em;
          text-align: center;
        }
      `}</style>
    </Page>
  )
}

CommunesList.getInitialProps = async ({query}) => {
  const communes = await getFantoir(query.departement)
  const departementInfos = await getDepartementByCode(query.departement)

  return {
    communes,
    nomDepartement: departementInfos.nom
  }
}

CommunesList.propTypes = {
  communes: PropTypes.array.isRequired,
  nomDepartement: PropTypes.string.isRequired
}

export default withErrors(CommunesList)
