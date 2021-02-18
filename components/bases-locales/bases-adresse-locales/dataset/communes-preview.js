import React from 'react'
import PropTypes from 'prop-types'

import {spaceThousands} from '@/lib/format-numbers'

import InfoReport from '../info-report'
import Info from '../info'
import Preview from './preview'

function contoursToGeoJson(contour) {
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: contour,
      properties: {}
    }]
  }
}

class CommunesPreview extends React.Component {
  static propTypes = {
    dataset: PropTypes.object.isRequired
  }

  render() {
    const {dataset} = this.props
    const {communes, model, license, dateMAJ, rowsCount} = dataset

    const infos = [
      {
        title: 'Format',
        value: model === 'bal-aitf' ? 'BAL (AITF)' : 'Spécifique',
        type: model === 'bal-aitf' ? 'valid' : 'not-valid'
      },
      {
        title: 'Licence',
        value: license === 'odc-odbl' ? 'ODbL 1.0' : 'Licence Ouverte 2.0',
        type: license === 'odc-odbl' ? 'not-valid' : 'valid'
      },
      {title: 'Dernière mise à jour', value: dateMAJ ? dateMAJ.split('-').reverse().join('-') : 'inconnue'},
      {title: 'Nombre de Communes', value: spaceThousands(communes.length)},
      {title: 'Nombre d’adresses', value: typeof rowsCount === 'number' ? spaceThousands(rowsCount) : '???'}
    ]

    return (
      <Preview geojson={contoursToGeoJson(dataset.contour)}>
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
