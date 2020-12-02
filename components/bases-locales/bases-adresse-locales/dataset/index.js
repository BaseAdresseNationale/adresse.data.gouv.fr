import React from 'react'
import PropTypes from 'prop-types'
import {withRouter, useRouter} from 'next/router'
import {Download} from 'react-feather'

import theme from '@/styles/theme'

import Section from '@/components/section'

import ButtonLink from '@/components/button-link'
import TableList from '@/components/table-list'

import Header from './header'
import Description from './description'
import CommunesPreview from './communes-preview'

const Dataset = ({dataset, summary}) => {
  const {title, description, url, organization, page} = dataset
  const {query, push} = useRouter()
  const cols = {
    nomCommune: {
      title: 'Nom de la commune',
      sortBy: 'alphabetical',
      getValue: commune => commune.nom
    },
    nomVoie: {
      title: 'Nombre de voie',
      sortBy: 'numeric',
      getValue: commune => commune.voiesCount
    },
    numerosCount: {
      title: 'Nombre de numéro',
      sortBy: 'numeric',
      getValue: commune => commune.numerosCount
    }
  }

  const selectCommune = item => {
    summary.communes.find(commune => commune.code === item.code)
    handleSelect(item.code)
  }

  const handleSelect = code => {
    push(
      `/bases-locales/jeux-de-donnees/${query.id}/${code}`
    )
  }

  return (
    <div>
      <Section>
        <Header name={title} logo={organization && organization.logo} />
        {description && page && <Description page={page} description={description} />}

        {url && <div className='links'>
          <ButtonLink isExternal href={url} size='large' >
            Télécharger <Download style={{verticalAlign: 'middle', marginLeft: '3px'}} />
          </ButtonLink>
        </div>}

        <CommunesPreview dataset={dataset} summary={summary} />

        <div className='list'>
          <TableList
            title={summary.communesCount === 1 ? 'Commune' : 'Communes'}
            subtitle={summary.communesCount === 1 ? `${summary.communesCount} commune répertoriée` : `${summary.communesCount} communes répertoriées`}
            list={summary.communes}
            textFilter={item => item.nom}
            cols={cols}
            handleSelect={selectCommune} />
        </div>
      </Section>

      <style jsx>{`
        h4 {
          background-color: ${theme.primary};
          color: ${theme.colors.white};
          padding: 1em;
          margin-bottom: 0;
        }

        .links {
          display: flex;
          flex-flow: wrap;
          align-items: center;
          font-size: 0.8em;
          margin: 3em 0;
        }

        .links a {
          margin: 1em 0;
        }

        .infos {
          display: flex;
          justify-content: space-between;
        }

        .counter {
          margin: 0 1em;
        }

        .sources {
          display: flex;
        }

        @media (max-width: 700px) {
          .infos {
            flex-direction: column;
            flex-flow: end;
            margin-top: 1em;
          }

          .counter {
            margin: 0;
          }

          .sources {
            margin-top: 0.5em;
            margin-left: -2px;
            flex-flow: wrap;
          }
        }
        `}</style>
    </div>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  summary: PropTypes.object.isRequired
}

export default withRouter(Dataset)
