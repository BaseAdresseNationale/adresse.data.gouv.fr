import React from 'react'
import PropTypes from 'prop-types'
import {useRouter} from 'next/router'

import {AlertTriangle} from 'react-feather'
import theme from '../../../../../styles/theme'

import Header from '../header'
import List from '../list'
import Item from '../item'

import Section from '../../../../section'
import Tag from '../../../../tag'
import {byText} from '../../../../../lib/filters'
import withFetch from '../../../../hoc/with-fetch'
import Breadcrumb from './breadcrumb'
import CommunePreview from './commune-preview'

const Commune = ({commune, voies, dataset}) => {
  const {id, title, organization} = dataset
  const {query} = useRouter()

  return (
    <div>
      <Section>
        <Breadcrumb links={[{link: title, href: `/bases-locales/jeux-de-donnees/${id}`}]} current={commune.nom} />

        <Header
          name={commune.nom}
          logo={organization && organization.logo} />

        <CommunePreview commune={commune} />
        <div className='list'>
          <h4>Liste des voies présentes dans le fichier</h4>
          <List
            list={voies}
            filter={(voie, input) => byText(voie.nomVoie, input)}
            toItem={voie => {
              const {numerosCount, codeVoie, nomVoie, source, position} = voie
              const namedPlace = numerosCount === 0

              return (
                <Item
                  key={codeVoie}
                  id={codeVoie}
                  name={nomVoie}
                  link={numerosCount > 0 || position ? `/bases-locales/jeux-de-donnees/${query.id}/${commune.code}/${codeVoie}` : null}
                >
                  <div className='infos'>
                    {namedPlace ? (
                      !position &&
                      <div className='namedPlace'>
                        <AlertTriangle /> <span>Ce lieu nommé ne possède pas encore de position renseignée.</span>
                      </div>
                    ) : (
                      <div className='counter'>
                        <b>{numerosCount}</b> {numerosCount > 1 ? 'numéros' : 'numéro'}
                      </div>
                    )}

                    <div className='sources'>
                      {namedPlace && <Tag type='toponyme' />}
                      {source.lenght > 0 && (
                        source.map(source => <Tag key={source} type={source} />)
                      )}
                    </div>
                  </div>
                </Item>
              )
            }} />
        </div>
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
