import React from 'react'
import PropTypes from 'prop-types'
import {union} from 'lodash'

import {getNumerosBbox} from '../../../lib/explore/api'
import {addressesToGeoJson, addressToGeoJson} from '../../../lib/geojson'

import Notification from '../../notification'
import Mapbox from '../../mapbox'

import AddressesMap from './addresses-map'

class MapContainer extends React.Component {
  static propTypes = {
    voie: PropTypes.object,
    addresses: PropTypes.array,
    selected: PropTypes.object,
    onSelect: PropTypes.func.isRequired
  }

  static defaultProps = {
    voie: null,
    addresses: null,
    selected: null
  }

  state = {
    addrsAround: []
  }

  selectAddress = feature => {
    const {onSelect} = this.props

    onSelect({numero: feature.properties.numero})
  }

  getAddrsAround = async bbox => {
    const {voie, addresses} = this.props

    try {
      const results = await getNumerosBbox(voie.codeCommune, bbox)
      this.setState(state => {
        const withoutVoie = results
          .filter(add => !addresses.find(address => address.id === add.id))

        return {
          addrsAround: union(withoutVoie, state.addrsAround)
        }
      })
    } catch (err) {
      this.setState({
        addrsAround: [],
        error: err
      })
    }
  }

  render() {
    const {addrsAround, error} = this.state
    const {voie, addresses, selected, onSelect} = this.props
    const data = selected ?
      addressToGeoJson(selected) :
      addressesToGeoJson(addresses)

    return (
      <div>
        {error ? (
          <Notification type='error' message={error} />
        ) : (
          <div className='map'>
            <Mapbox>
              {map => (
                <AddressesMap
                  map={map}
                  data={data}
                  selected={selected}
                  voie={voie}
                  addrsAround={addressesToGeoJson(addrsAround)}
                  onClose={onSelect}
                  handleMove={this.getAddrsAround}
                  handleSelect={this.selectAddress}
                />
              )}
            </Mapbox>
          </div>
        )}

        <style jsx>{`
          .map {
            border: 1px solid whitesmoke;
          }
        `}</style>
      </div>
    )
  }
}

export default MapContainer
