import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'next/router'
import {Download} from 'react-feather'

import theme from '../../../../styles/theme'
import {byText} from '../../../../lib/filters'

import Section from '../../../section'

import ButtonLink from '../../../button-link'
import Tag from '../../../tag'

import List from './list'
import Item from './item'

import Header from './header'
import Description from './description'
import CommunesPreview from './communes-preview'

class Dataset extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
      query: PropTypes.object.isRequired
    }).isRequired
  }

  render() {
    const {dataset, summary, router} = this.props
    const {title, description, url, organization, page} = dataset

    return (
      <div>
        <Section>
          <Header name={title} logo={organization && organization.logo} />
          {description && page && <Description page={page} description={description} />}

          {url && <div className='links'>
            <ButtonLink href={url} size='large' >
              Télécharger <Download style={{verticalAlign: 'middle', marginLeft: '3px'}} />
            </ButtonLink>
          </div>}

          <CommunesPreview dataset={dataset} summary={summary} />

          <div className='list'>
            <h4>Liste des communes présentes dans le fichier</h4>
            <List
              list={summary.communes}
              filter={(commune, input) => byText(commune.nom, input)}
              toItem={commune => (
                <Item
                  key={commune.code}
                  name={commune.nom}
                  link={`/bases-locales/jeux-de-donnees/${router.query.id}/${commune.code}`}
                >
                  <div className='infos'>
                    <div className='counter'>
                      <b>{commune.voiesCount}</b> {commune.voiesCount > 1 ? 'voies' : 'voie'}
                    </div>
                    <div className='counter'>
                      <b>{commune.numerosCount}</b> {commune.numerosCount > 1 ? 'numéros' : 'numéro'}
                    </div>
                    <div className='sources'>
                      {commune.source.lenght > 0 && (
                        commune.source.map(source => <Tag key={source} type={source} />)
                      )}
                    </div>
                  </div>
                </Item>
              )} />
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
}

export default withRouter(Dataset)
