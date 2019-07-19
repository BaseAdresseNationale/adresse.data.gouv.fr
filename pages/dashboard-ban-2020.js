import React, {useState, useCallback} from 'react'
import PropTypes from 'prop-types'
import Page from '../layouts/main'

import withErrors from '../components/hoc/with-errors'

import {getDepartements, getDepartementCommunes} from '../lib/api-ban'

import Mapbox from '../components/mapbox'

import BANMap from '../components/ban-dashboard/ban-map'

const title = 'Base Adresse National 2020 - Tableau de bord'
const description = ''

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

function DashboardBan2020({departements}) {
  const [departement, setDepartement] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDepartement = useCallback(async codeDepartement => {
    setIsLoading(true)
    setError(null)

    try {
      const departement = await getDepartementCommunes(codeDepartement)
      departement.features.forEach(generateId)
      setDepartement(departement)
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  })

  const reset = useCallback(() => {
    setDepartement(null)
    setError(null)
  })

  return (
    <Page title={title} description={description} showFooter={false}>

      <div className='ban-map-container'>
        <Mapbox error={error} loading={isLoading} fullscreen>
          {({...mapboxProps}) => (
            <BANMap
              {...mapboxProps}
              departements={departements}
              communes={departement}
              loading={isLoading}
              selectDepartement={loadDepartement}
              reset={reset}
            />
          )}
        </Mapbox>
      </div>

      <style jsx>{`
        .error {
          position: absolute;
          z-index: 999;
          margin: 1em;
        }

        .ban-map-container {
          width: 100%;
          height: calc(100vh - 73px);
        }

        @media (max-width: 380px) {
          .ban-map-container {
            height: calc(100vh - 63px);
          }
        }
      `}</style>
    </Page>
  )
}

DashboardBan2020.propTypes = {
  departements: PropTypes.object.isRequired
}

DashboardBan2020.getInitialProps = async () => {
  const departements = await getDepartements()
  departements.features.forEach(generateId)

  return {
    departements
  }
}

export default withErrors(DashboardBan2020)
