import React from 'react'
import PropTypes from 'prop-types'

import {spaceThousands} from '@/lib/format-numbers'
import {contoursToGeoJson} from '@/lib/geojson'

import Info from '../../info'

import Preview from '../preview'

class CommunesPreview extends React.Component {
  static propTypes = {
    commune: PropTypes.object.isRequired
  }

  render() {
    const {commune} = this.props
    const {voiesCount, numerosCount, population, dateMAJ} = commune
    const infos = [
      {title: 'Dernière mise à jour', value: dateMAJ ? dateMAJ.split('-').reverse().join('-') : 'inconnue'},
      {title: 'Nombre de voies', value: spaceThousands(voiesCount)},
      {title: 'Nombre d’adresses', value: spaceThousands(numerosCount)},
      {title: 'Habitants', value: spaceThousands(population)}
    ]
    return (
      <Preview geojson={contoursToGeoJson([commune])}>
        <div className='meta'>
          {infos.map(info => (
            <div key={info.title}>
              <Info title={info.title}>
                <span>{info.value}</span>
              </Info>
            </div>
          ))}
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
