import {useCallback, useEffect, useState, useMemo} from 'react'
import PropTypes from 'prop-types'
import {debounce, deburr} from 'lodash'
import {ExternalLink} from 'react-feather'

import theme from '@/styles/theme'

import Container from '@/components/container'
import Notification from '@/components/notification'
import SearchBar from '@/components/search-bar'

import BaseAdresseLocale from './base-adresse-locale'

const DATASETS_COUNT = 10

const sortByDateMAJ = datasets => {
  const datasetsWithDateMAJ = datasets.filter(data => data.dateMAJ)
  const datasetsWithoutDateMAJ = datasets.filter(data => !data.dateMAJ)

  return [
    ...datasetsWithDateMAJ.sort((a, b) => a.dateMAJ < b.dateMAJ ? 1 : -1),
    ...datasetsWithoutDateMAJ
  ]
}

function BasesAdresseLocales({datasets}) {
  const [search, setSearch] = useState('')
  const orderedResults = sortByDateMAJ(datasets)
  const [results, setResults] = useState(orderedResults)

  const filterDatasets = useCallback(search => {
    const filterDatasets = datasets.filter(({title}) => {
      const titleFormatted = deburr(title.toLowerCase())
      const searchFormatted = deburr(search.toLowerCase())
      return titleFormatted.includes(searchFormatted)
    })

    const sortedDatasets = sortByDateMAJ(filterDatasets)
    setResults(sortedDatasets)
  }, [datasets])

  const debouncedSearch = useMemo(
    () => debounce(filterDatasets, 300)
    , [filterDatasets])

  useEffect(() => {
    if (search === '') {
      setResults(datasets)
    } else {
      debouncedSearch(search)
    }
  }, [search, datasets, debouncedSearch])

  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  return (
    <>
      <Notification isFullWidth>
        <p>Cette page recense toutes les <strong>Bases Adresses Locales</strong> connues à ce jour.</p>
        <p>Pour référencer la vôtre facilement, publiez-la sur <b>data.gouv.fr</b> avec le mot-clé <span className='tag'>base-adresse-locale</span>. Votre organisation devra auparavant avoir été <b>certifiée</b>.<br />Vous pouvez aussi utiliser <b>Mes Adresses</b>, qui dispose d’un outil de publication simplifié.</p>

        <div className='discover-more'>
          <h3>En savoir un peu plus</h3>
          <ul className='discover-links'>
            <li><ExternalLink /><a href='https://www.data.gouv.fr'>Visiter le site data.gouv.fr</a></li>
            <li><ExternalLink /><a href='https://doc.data.gouv.fr/organisations/certifier-une-organisation/'>Comment certifier une organisation ? Suivez la documentation !</a></li>
            <li><ExternalLink /><a href='https://mes-adresses.data.gouv.fr' target='_blank' rel='noreferrer'>Publier sa Base Adresse Locale sur Mes Adresses</a></li>
          </ul>
        </div>
      </Notification>
      <Container>
        <SearchBar
          label='Rechercher une Base adresse locale'
          placeholder='Nancy'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {results.length > 1 && (
          <h3 className='bal-subtitle'>Les {results.length < DATASETS_COUNT ? results.length : DATASETS_COUNT} dernières Bases Adresses Locales publiées</h3>
        )}

        {results.length > 0 ? (
          <div className='bases'>
            {sortByDateMAJ(results).slice(0, DATASETS_COUNT).map(dataset => (
              <BaseAdresseLocale key={dataset.id} dataset={dataset} />
            ))}
          </div>
        ) : (
          <div className='no-result'>
            Aucun résultat
          </div>
        )}
      </Container>

      <style jsx>{`
          .bal-subtitle {
            margin-top: 0.5em;
            text-align: center;
          }

          .bases {
            display: grid;
            grid-row-gap: 2em;
            margin: 4em 0;
          }

          .tag {
            display: inline;
            background-color: ${theme.primary};
            color: ${theme.colors.white};
            padding: .2em .6em .3em;
            font-size: 75%;
            font-weight: 700;
            line-height: 1;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: .25em;
          }

          .no-result {
            margin-top: 1em;
          }

          .discover-more {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 2em;
          }

          h3 {
            text-align: center;
            margin: 0;
          }

          .discover-links {
            list-style-type: none;
            padding: 0;
            width: fit-content;
          }

          .discover-links li {
            margin: 10px 0;
            display: grid;
            grid-template-columns: 20px 1fr;
            justify-items: left;
            gap: 10px;
            color: ${theme.primary};
          }
      `}</style>
    </>
  )
}

BasesAdresseLocales.propTypes = {
  datasets: PropTypes.array.isRequired
}

export default BasesAdresseLocales
