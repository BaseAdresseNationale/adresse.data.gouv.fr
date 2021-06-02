import React, {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {debounce, deburr} from 'lodash'

import theme from '@/styles/theme'

import Container from '@/components/container'
import Notification from '@/components/notification'
import SearchBar from '@/components/search-bar'

import BaseAdresseLocale from './base-adresse-locale'

function BasesAdresseLocales({datasets}) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState(datasets)

  const getFilteredDatasets = useCallback(debounce(value => {
    const filteredDatasets = datasets.filter(({title}) => {
      const titleFormatted = deburr(title.toLowerCase())
      const searchFormatted = deburr(value.toLowerCase())

      return titleFormatted.includes(searchFormatted)
    })

    setResults(filteredDatasets)
  }, 300), [datasets])

  useEffect(() => {
    if (search === '') {
      setResults(datasets)
    } else {
      getFilteredDatasets(search)
    }
  }, [search, datasets, getFilteredDatasets])

  return (
    <>
      <Notification isFullWidth>
        <p>Cette page recense toutes les <strong>Bases Adresses Locales</strong> connues à ce jour.</p>
        <p>Pour référencer la vôtre facilement, publiez-la sur <a href='https://www.data.gouv.fr'>data.gouv.fr</a> avec le mot-clé <span className='tag'>base-adresse-locale</span>. Votre organisation devra auparavant avoir été <a href='https://doc.data.gouv.fr/organisations/certifier-une-organisation/'>certifiée</a>.<br />Vous pouvez aussi utiliser <a target='_blank' rel='noreferrer' href='https://mes-adresses.data.gouv.fr'>Mes Adresses</a>, qui dispose d’un outil de publication simplifié.</p>
      </Notification>
      <Container>
        <SearchBar
          label='Rechercher une Base adresse locale'
          placeholder='Hémevez'
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {results.length > 0 ? (
          <div className='bases'>
            {results.slice(0, 10).map(dataset => (
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
          `}</style>
    </>
  )
}

BasesAdresseLocales.propTypes = {
  datasets: PropTypes.array.isRequired
}

export default BasesAdresseLocales
