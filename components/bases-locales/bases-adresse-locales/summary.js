import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import MdFileDownload from 'react-icons/lib/md/file-download'

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
      {title: 'Format', value: model === 'bal-aitf' ? 'BAL 1.1 (AITF)' : 'Spécifique'},
      {title: 'Licence', value: license === 'odc-odbl' ? 'ODbL 1.0' : 'Licence Ouverte 2.0'},
      {title: 'Dernière mise à jour', value: dateMAJ || 'inconnue'},
      {title: 'Nombre d’adresses', value: typeof numerosCount === 'number' ? spaceThousands(numerosCount) : '???'}
    ]
    return (
      <div>
        <div className='base-adresse-locale'>
          {organization ? <Organization {...organization} /> : null}

          <div className='meta'>
            {infos.map(info => (
              <div key={info.title}>
                <Info title={info.title}>
                  <span>{info.value}</span>
                </Info>
              </div>
            ))}

            {model === 'bal-aitf' &&
              <InfoReport dataset={dataset} />
            }
          </div>

          <div className='links'>
            <Link href={`/bases-locales/jeux-de-donnees/${id}`}>
              <ButtonLink>
                Consulter
              </ButtonLink>
            </Link>
            {url &&
              <Link href={url}>
                <a>Télécharger <MdFileDownload /></a>
              </Link>}
          </div>
        </div>

        <style jsx>{`
          .base-adresse-locale {
            display: flex;
            justify-content: space-between;
            flex-flow: wrap;
            align-items: center;
          }

          .base-adresse-locale div {
            margin: 1em auto;
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
            grid-template-columns: repeat(auto-fit, minmax(170px, 100%));
            grid-gap: 5px;
          }
        `}</style>
      </div>
    )
  }
}

export default Summary
