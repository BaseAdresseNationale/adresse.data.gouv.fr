import React from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import theme from '../../../../../styles/theme'

import Header from '../header'

import Section from '../../../../section'
import withFetch from '../../../../hoc/with-fetch'
import TableList from '../../../../table-list'
import NoPositionWarning from '../../../../no-position-warning'
import Breadcrumb from './breadcrumb'
import CommunePreview from './commune-preview'

const Commune = ({commune, voies, dataset}) => {
  const {id, title, organization} = dataset
  const {query, push} = useRouter()
  const noPosition = 'Ce lieu nommé ne possède pas encore de position renseignée.'
  const headers = [
    {
      title: 'Nom de voie',
      type: 'alphabetical',
      func: voie => voie.nomVoie
    },
    {
      title: 'Nombre d’adresses',
      type: 'numeric',
      func: voie => voie.numerosCount
    }
  ]

  const selectVoie = item => {
    voies.find(voie => voie.idVoie === item.key)
    if (typeof item.values[1] === 'number') {
      handleSelect(item.key)
    } else if (item.values[1].props.check) {
      handleSelect(item.key)
    }
  }

  const handleSelect = codeVoie => {
    push(
      `/bases-locales/jeux-de-donnees/${query.id}/${commune.code}/${codeVoie}`
    )
  }

  const genItems = voies => {
    return voies.map(voie => {
      return {
        key: voie.codeVoie,
        values: [
          voie.nomVoie,
          voie.numerosCount === 0 ? <NoPositionWarning check={voie.position} text={noPosition} /> : voie.numerosCount
        ]
      }
    })
  }

  return (
    <div>
      <Section>
        <Breadcrumb links={[{link: title, href: `/bases-locales/jeux-de-donnees/${id}`}]} current={commune.nom} />

        <Header
          name={commune.nom}
          logo={organization && organization.logo} />

        <CommunePreview commune={commune} />

        <TableList
          title='Voies de la commune'
          subtitle={`${voies.length} voies répertoriées`}
          list={voies}
          headers={headers}
          genItems={genItems}
          initialSort={headers[0]}
          handleSelect={selectVoie} />
      </Section>
      <style jsx>{`
        h4 {
          background-color: ${theme.primary};
          color: ${theme.colors.white};
          padding: 1em;
          margin-bottom: 0;
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

        .namedPlace {
          display: flex;
          align-items: center;
          color: ${theme.errorBorder};
          margin: 0 1em;
        }

        .namedPlace span {
          margin-left: 0.5em;
        }

        @media (max-width: 700px) {
          .infos {
            flex-direction: column;
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

          .namedPlace {
            margin: 0;
          }
      `}</style>
    </div>
  )
}

Commune.propTypes = {
  dataset: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    page: PropTypes.string,
    organization: PropTypes.object
  }).isRequired,
  voies: PropTypes.array,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    voies: PropTypes.arrayOf(
      PropTypes.shape({
        numerosCount: PropTypes.number.isRequired,
        codeVoie: PropTypes.string.isRequired,
        nomVoie: PropTypes.string.isRequired,
        source: PropTypes.array.isRequired,
        position: PropTypes.object
      })
    ).isRequired
  })
}

Commune.defaultProps = {
  voies: null,
  commune: null
}

export default withFetch(data => ({
  commune: data,
  voies: data.voies
}))(Commune)
