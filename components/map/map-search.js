import React from 'react'
import debounce from 'debounce'

import LeafletMap from './leaflet-map'
import SearchInput from './search-input'

class MapSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {features: [], selected: null, value: '', loading: false}
    this.search = debounce(this.search, 200)
  }

  updateValue(value) {
    const url = 'https://api-adresse.data.gouv.fr/search/?q=' + value
    this.setState({value, features: [], loading: true}, this.search(url))
  }

  search(url) {
    fetch(url).then(response => {
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.indexOf('application/json') !== -1) {
        response.json().then(json => {
          this.setState({
            features: json.features || [],
            loading: false
          })
        })
      } else {
        this.setState({
          features: [],
          loading: false
        })
      }
    })
  }

  selectFeature(feature) {
    this.setState({selected: feature, value: feature.properties.label})
  }

  render() {
    const {features, value, selected, loading} = this.state

    return (
      <div>
        <SearchInput value={value} features={features} loading={loading} search={input => this.updateValue(input)} handleSelect={feature => this.selectFeature(feature)} />
        <LeafletMap position={selected ? selected.geometry.coordinates.reverse() : undefined} />
      </div>
    )
  }
}

export default MapSearch
