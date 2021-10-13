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

function Dataset({dataset}) {
  const {title, description, url, organization, page} = dataset
  const {push} = useRouter()
  const cols = {
    nomCommune: {
      title: 'Nom de la commune',
      sortBy: 'alphabetical',
      getValue: commune => commune.nom
    },
    numerosCount: {
      title: 'Nombre d’adresses',
      sortBy: 'numeric',
      getValue: commune => commune.rowsCount
    }
  }

  const selectCommune = item => {
    dataset.communes.find(commune => commune.code === item.code)
    handleSelect(item.code)
  }

  const handleSelect = code => {
    push(
      `/base-adresse-nationale/${code}`
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

        <CommunesPreview dataset={dataset} />

        <div className='list'>
          <TableList
            title={dataset.communes.length === 1 ? 'Commune' : 'Communes'}
            subtitle={dataset.communes.length === 1 ? '1 commune répertoriée' : `${dataset.communes.length} communes répertoriées`}
            list={dataset.communes}
            textFilter={item => item.nom}
            cols={cols}
            handleSelect={selectCommune} />
        </div>
      </Section>

      <style jsx>{`
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
        `}</style>
    </div>
  )
}

Dataset.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default withRouter(Dataset)
