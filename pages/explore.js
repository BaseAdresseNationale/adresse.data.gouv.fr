import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import computeBbox from '@turf/bbox'

import Page from '../layouts/main'

import {getDepartements, getDepartementCommunes} from '../lib/api-ban'

import Mapbox from '../components/mapbox'
import AddressesMap from '../components/mapbox/addresses-map'
import SearchCommune from '../components/explorer/search-commune'

const title = 'Consulter'
const description = 'Consulter les adresses'

function generateDepartementId(feature) {
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

function generateCommuneId(feature) {
  feature.id = feature.properties.code
}

const Explore = ({departements}) => {
  const [communes, setCommunes] = useState(null)
  const bbox = communes ? computeBbox(communes) : null

  const selectDepartement = async feature => {
    const codeDepartement = feature.id
    const communes = await getDepartementCommunes(codeDepartement)

    communes.features.forEach(generateCommuneId)

    setCommunes(communes)
  }

  const selectCommune = feature => {
    const codeCommune = feature.id
    const href = `/explore/commune/?codeCommune=${codeCommune}`
    const as = `/explore/commune/${codeCommune}`

    Router.push(href, as)
  }

  return (
    <Page title={title} description={description} showFooter={false}>
      <SearchCommune />
      <div className='explore-map-container'>
        <Mapbox bbox={bbox} switchStyle>
          {({...mapboxProps}) => (
            <AddressesMap
              {...mapboxProps}
              contour={communes || departements}
              onSelectContour={communes ? selectCommune : selectDepartement}
            />
          )}
        </Mapbox>
      </div>

      <style jsx>{`
        .explore-map-container {
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

  departements.features.forEach(generateDepartementId)

  return {
    departements
  }
}

export default Explore
