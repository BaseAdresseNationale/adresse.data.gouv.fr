import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Page from '../layouts/main'

import withErrors from '../components/hoc/with-errors'

import {getDepartements, getDepartementCommunes} from '../lib/api-ban'

import Mapbox from '../components/mapbox'
import Notification from '../components/notification'

import BANMap from '../components/ban-dashboard/ban-map'

const title = 'Base Adresse National - Tableau de bord'
const description = ''

function mockAPI(item) {
  item.properties.banV0 = Math.floor(Math.random() * 100) + 0
  item.properties.banLO = Math.floor(Math.random() * 100) + 0
  item.properties.both = Math.floor(Math.random() * 100) + 0
  item.properties.fake = Math.floor(Math.random() * 100) + 0
}

function BANDashboard({departements}) {
  const [departement, setDepartement] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDepartement = useCallback(async codeDepartement => {
    setIsLoading(true)

    try {
      const departement = await getDepartementCommunes(codeDepartement, {
        geometry: 'contour',
        format: 'geojson'
      })
      departement.features.forEach(mockAPI)

      setDepartement(departement)
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  })

  return (
    <Page title={title} description={description}>

      {error &&
        <Notification
          message={error.message}
          type='error' />
      }

      <Mapbox fullscreen>
        {(map, marker, popUp) => (
          <BANMap
            map={map}
            popUp={popUp}
            departements={departements}
            communes={departement}
            loading={isLoading}
            selectDepartement={loadDepartement}
          />
        )}
      </Mapbox>
    </Page>
  )
}

BANDashboard.propTypes = {
  departements: PropTypes.object.isRequired,
  defaultDepartement: PropTypes.object
}

BANDashboard.defaultProps = {
  defaultDepartement: null
}

BANDashboard.getInitialProps = async () => {
  const departements = await getDepartements()

  departements.features.forEach(mockAPI)

  return {
    departements
  }
}

export default withErrors(BANDashboard)
