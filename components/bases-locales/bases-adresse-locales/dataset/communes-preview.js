import React from 'react'
import PropTypes from 'prop-types'

import {contoursToGeoJson} from '../../../../lib/geojson'
import {spaceThousands} from '../../../../lib/format-numbers'

import InfoReport from '../info-report'
import Info from '../info'
import Preview from './preview'

class CommunesPreview extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired,
    summary: PropTypes.shape({
      communes: PropTypes.array.isRequired,
      source: PropTypes.array.isRequired,
      communesCount: PropTypes.number.isRequired,
      voiesCount: PropTypes.number.isRequired,
      numerosCount: PropTypes.number.isRequired
    }).isRequired
  }

  render() {
    const {dataset, summary} = this.props
    const {model, license, dateMAJ} = dataset
    const {communes, communesCount, voiesCount, numerosCount} = summary

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
      {title: 'Dernière mise à jour', value: dateMAJ || 'inconnue'},
      {title: 'Nombre de Communes', value: spaceThousands(communesCount)},
      {title: 'Nombre de Voies', value: spaceThousands(voiesCount)},
      {title: 'Nombre d’adresses', value: typeof numerosCount === 'number' ? spaceThousands(numerosCount) : '???'}
    ]

    return (
      <Preview geojson={communes.length > 0 ? contoursToGeoJson(communes) : null}>
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
        <style jsx>{`
          .meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(170px, 100%));
            grid-gap: 5px;
          }
        `}</style>
      </Preview>
    )
  }
}

export default CommunesPreview
