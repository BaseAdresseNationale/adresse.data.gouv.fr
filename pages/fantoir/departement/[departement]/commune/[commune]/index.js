import {useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {sortBy, debounce} from 'lodash'

import {Database, Download} from 'react-feather'

import {getFantoir, getVoiesFantoir, API_BAN_URL} from '@/lib/api-ban'

import theme from '@/styles/theme'

import Page from '@/layouts/main'
import Head from '@/components/head'
import withErrors from '@/components/hoc/with-errors'
import Section from '@/components/section'
import SearchBar from '@/components/search-bar'
import HeaderListFantoir from '@/components/fantoir/header-list-fantoir'
import VoieInformation from '@/components/fantoir/voie-information'
import ButtonLink from '@/components/button-link'

const voieHeader = ['Nom de la voie', 'type', 'Code FANTOIR']

function VoiesList({voies, nomCommune, codeCommune}) {
  const sortedVoies = useMemo(() => {
    return sortBy(voies, ['id'])
  }, [voies])

  const [results, setResults] = useState(sortedVoies)

  const searchVoies = debounce(value => {
    const foundVoie = sortedVoies.filter(v => v.libelleVoieComplet.toLowerCase().includes(value.toLowerCase()))

    setResults(foundVoie)
  }, 300)

  return (
    <Page title='FANTOIR'>
      <Head title={`FANTOIR : ${nomCommune}`} icon={<Database size={56} alt='' />} />
      <Section title={`Liste des voies - ${nomCommune}`}>
        <div className='search'>
          <SearchBar
            placeholder='Chercher une voie'
            onChange={e => searchVoies(e.target.value)}
          />
        </div>
        <div className='csv-link'>
          <ButtonLink
            href={`${API_BAN_URL}/api-fantoir/communes/${codeCommune}/voies.csv`}
            size='small'
            isExternal
          >
            Télécharger au format CSV
            <Download style={{verticalAlign: 'bottom', padding: '3px'}} alt='' />
          </ButtonLink>
        </div>

        <HeaderListFantoir
          headers={voieHeader}
          hasToggleContent
        />

        {results.length > 0 ? (
          results.map(voie => (
            <VoieInformation
              key={voie.id}
              voie={voie}
            />
          ))
        ) : (
          <div className='no-result'>
            <i>Aucun résultat</i>
          </div>
        )}
      </Section>
      <style jsx>{`
        .margin {
          width: 45px;
        }

        .title {
          background-color: ${theme.primary};
          color: #FFF;
          display: flex;
          border-top: 1px solid ${theme.border};
          border-left: 1px solid ${theme.border};
          border-right: 1px solid ${theme.border};
        }

        .name {
          flex: 2;
          margin: auto;
          padding: .5em;
        }

        .infos {
          flex: 1;
          margin: auto;
          padding: .5em;
        }

        .search {
          padding: 1em 0;
        }

        .no-result {
          padding: 1em;
          font-size: 1.2em;
          text-align: center;
        }

        .csv-link {
          text-align: right;
          padding: .5em;
        }
      `}</style>
    </Page>
  )
}

VoiesList.getInitialProps = async ({query}) => {
  const voies = await getVoiesFantoir(query.commune)
  const communes = await getFantoir(query.departement)
  const {nomCommune} = communes.find(c => c.codeCommune === query.commune)

  return {
    voies,
    nomCommune,
    codeCommune: query.commune
  }
}

VoiesList.propTypes = {
  voies: PropTypes.array.isRequired,
  nomCommune: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired
}

export default withErrors(VoiesList)
