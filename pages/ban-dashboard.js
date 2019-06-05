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

function generateId(feature) {
  feature.id = feature.properties.code
}

function BANDashboard({departements}) {
  const [departement, setDepartement] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDepartement = useCallback(async codeDepartement => {
    setIsLoading(true)

    try {
      const departement = await getDepartementCommunes(codeDepartement)
      departement.features.forEach(generateId)
      setDepartement(departement)
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  })

  return (
    <Page title={title} description={description} showFooter={false}>

      {error &&
      <div className='error'>
        <Notification
          message={error.message}
          type='error' />

        <style jsx>{`
          .error {
            position: absolute;
            z-index: 999;
            margin: 1em;
          }
        `}</style>
      </div>
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
            reset={() => setDepartement(null)}
          />
        )}
      </Mapbox>
    </Page>
  )
}

BANDashboard.propTypes = {
  departements: PropTypes.object.isRequired
}

BANDashboard.getInitialProps = async () => {
  const departements = await getDepartements()
  departements.features.forEach(generateId)

  return {
    departements
  }
}

export default withErrors(BANDashboard)
