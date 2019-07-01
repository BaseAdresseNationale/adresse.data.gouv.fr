import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import computeBbox from '@turf/bbox'

import Page from '../layouts/main'

import {getDepartements, getDepartementCommunes} from '../lib/api-ban'

import Mapbox from '../components/mapbox'
import AddressesMap from '../components/mapbox/addresses-map'
import SearchCommune from '../components/explorer/search-commune'

const title = 'Consulter'
const description = 'Consulter les adresses'

function generateId(feature) {
  const {code} = feature.properties
  feature.id = feature.properties.code

  // Corse
  if (code === '2A') {
    feature.id = 200
  } else if (code === '2B') {
    feature.id = 201
  } else {
    feature.id = code.replace(/[AB]/, 0)
  }
}

const Explore = ({departements}) => {
  const [communes, setCommunes] = useState()
  const bbox = communes ? computeBbox(communes) : null

  const selectDepartement = useCallback(async codeDepartement => {
    const communes = await getDepartementCommunes(codeDepartement)
    communes.features.forEach(feature => {
      feature.id = feature.properties.code
    })
    setCommunes(communes)
  })

  const selectCommune = useCallback(codeCommune => {
    console.log('TCL: Explore -> selectCommune', codeCommune)
  })

  return (
    <Page title={title} description={description} showFooter={false}>
      <SearchCommune />
      <div className='map-container'>
        <Mapbox bbox={bbox} switchStyle>
          {({map, setSources, setLayers}) => (
            <AddressesMap
              map={map}
              contour={communes || departements}
              onSelectContour={communes ? selectCommune : selectDepartement}
              setSources={setSources}
              setLayers={setLayers}
            />
          )}
        </Mapbox>
      </div>

      <style jsx>{`
        .map-container {
          height: calc(100vh - 350px);
        }
      `}</style>
    </Page>
  )
}

Explore.propTypes = {
  departements: PropTypes.object.isRequired
}

Explore.getInitialProps = async () => {
  const departements = await getDepartements()
  departements.features.forEach(generateId)

  return {
    departements
  }
}

export default Explore
