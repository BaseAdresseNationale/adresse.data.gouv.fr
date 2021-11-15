import React from 'react'
import PropTypes from 'prop-types'
import {DownloadCloud} from 'react-feather'

import ButtonLink from '@/components/button-link'
import {spaceThousands} from '@/lib/format-numbers'

import Organization from './organization'
import Info from './info'

class Summary extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired
  }

  render() {
    const {dataset} = this.props
    const {id, organization, url, model, dateMAJ, rowsCount, communes} = dataset
    const infos = [
      {
        title: 'Format',
        value: model === 'bal-aitf' ? 'BAL (AITF)' : 'Spécifique',
        type: model === 'bal-aitf' ? 'valid' : 'not-valid'
      },
      {title: 'Dernière mise à jour', value: dateMAJ ? dateMAJ.split('-').reverse().join('-') : 'inconnue'},
      {title: 'Nombre d’adresses', value: typeof rowsCount === 'number' ? spaceThousands(rowsCount) : '???'},
      {title: 'Communes couvertes', value: communes.length}
    ]

    return (
      <div>
        <div className='base-adresse-locale'>
          <Organization {...organization} />

          <div className='meta'>
            {infos.map(info => (
              <div key={info.title}>
                <Info title={info.title} type={info.type}>
                  <span>{info.value}</span>
                </Info>
              </div>
            ))}
          </div>

          <div className='links'>
            <ButtonLink href={`/bases-locales/jeux-de-donnees/${id}`}>
              Consulter
            </ButtonLink>
            {url &&
              <a href={url}><DownloadCloud size={18} style={{verticalAlign: 'middle', marginRight: '5px'}} />Télécharger </a>}
          </div>
        </div>

        <style jsx>{`
          .base-adresse-locale {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            grid-row-gap: 3em;
            justify-items: center;
            align-items: center;
          }

          .links {
            display: flex;
            flex-flow: column;
            align-items: center;
          }

          .links a {
            margin: 1em 0;
          }

          .meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            grid-gap: 5px;
          }
        `}</style>
      </div>
    )
  }
}

export default Summary
