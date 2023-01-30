import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'
import {sortBy, debounce, pick} from 'lodash'

import {getDepartements} from '@/lib/api-geo'

import {Database} from 'react-feather'

import Page from '@/layouts/main'
import withErrors from '@/components/hoc/with-errors'
import Head from '@/components/head'
import Section from '@/components/section'
import SearchBar from '@/components/search-bar'
import HeaderListFantoir from '@/components/fantoir/header-list-fantoir'
import BodyListFantoir from '@/components/fantoir/body-list-fantoir'

const title = 'FANTOIR'
const departementHeader = ['Département', 'Code département']
const departementInfos = ['nom', 'code']

function Fantoir({departements}) {
  const router = useRouter()
  const sortedDepartements = useMemo(() => {
    return sortBy(departements, ['code'])
  }, [departements])

  const [results, setResults] = useState(sortedDepartements)

  const searchDepartement = debounce(value => {
    const foundDepartement = sortedDepartements.filter(c => c.nom.toLowerCase().includes(value.toLowerCase()))

    setResults(foundDepartement)
  }, 300)

  return (
    <Page title={title}>
      <Head title={title} icon={<Database size={56} alt='' aria-hidden='true' />} />
      <Section title='Liste des départements'>
        <div className='search'>
          <SearchBar
            placeholder='Chercher un département'
            onChange={e => searchDepartement(e.target.value)}
          />
        </div>

        <HeaderListFantoir
          headers={departementHeader}
        />

        {results.length > 0 ? (
          results.map(departement => {
            const formatedDepartement = pick(departement, departementInfos)

            return (
              <BodyListFantoir
                key={departement.code}
                contents={Object.values(formatedDepartement)}
                onSelect={() => router.push(`/fantoir/departement/${departement.code}`)}
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

Fantoir.getInitialProps = async () => {
  const departements = await getDepartements()
  return {departements}
}

Fantoir.propTypes = {
  departements: PropTypes.array.isRequired
}

export default withErrors(Fantoir)
