import React from 'react'
import PropTypes from 'prop-types'
import {Download} from 'react-feather'

import ButtonLink from '../../button-link'
import {spaceThousands} from '../../../lib/format-numbers'

import Organization from './organization'
import Info from './info'
import InfoReport from './info-report'

class Summary extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired
  }

  render() {
    const {dataset} = this.props
    const {id, organization, url, model, dateMAJ, numerosCount, license} = dataset
    const infos = [
      {
        title: 'Format',
        value: model === 'bal-aitf' ? 'BAL 1.1 (AITF)' : 'Spécifique',
        type: model === 'bal-aitf' ? 'valid' : 'not-valid'
      },
      {
        title: 'Licence',
        value: license === 'odc-odbl' ? 'ODbL 1.0' : 'Licence Ouverte 2.0',
        type: license === 'odc-odbl' ? 'not-valid' : 'valid'
      },
      {title: 'Dernière mise à jour', value: dateMAJ ? dateMAJ.split('-').reverse().join('-') : 'inconnue'},
      {title: 'Nombre d’adresses', value: typeof numerosCount === 'number' ? spaceThousands(numerosCount) : '???'}
    ]
    return (
      <div>
        <div className='base-adresse-locale'>
          {organization ? <Organization {...organization} /> : <img src='../../images/no-img.png' />}

          <div className='meta'>
            {infos.map(info => (
              <div key={info.title}>
                <Info title={info.title} type={info.type}>
                  <span>{info.value}</span>
                </Info>
              </div>
            ))}

            {model === 'bal-aitf' &&
              <InfoReport dataset={dataset} />}
          </div>

          <div className='links'>
            <ButtonLink href={`/bases-locales/jeux-de-donnees/${id}`}>
              Consulter
            </ButtonLink>
            {url &&
              <a href={url}>Télécharger <Download size={18} style={{verticalAlign: 'middle', marginLeft: '3px'}} /></a>}
          </div>
        </div>

        <style jsx>{`
          .base-adresse-locale {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
            grid-row-gap: 1em;
            justify-items: center;
            align-items: center;
          }

          img {
            max-width: 9em;
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
