import {useState, useEffect, useCallback} from 'react'
import PropTypes from 'prop-types'

import {getDepartementsByRegion} from '@/lib/api-geo'

import Dropdown from './dropdown'
import Commune from './commune'

function RegionDropdown({code, nom, communes}) {
  const [departements, setDepartements] = useState([])

  const foundCommunes = communes.filter(commune => commune.codeRegion === code)

  const fetchDepartements = useCallback(async () => {
    const regionDepartements = await getDepartementsByRegion(code)

    // Trouver les départements accueillant les communes partenaires
    const filteredDepartements = []
    const filteredDepartementsCodes = []
    for (const departement of regionDepartements) {
      for (const commune of foundCommunes) {
        if (commune.codeDepartement.includes(departement.code) && !filteredDepartementsCodes.includes(departement.code)) {
          filteredDepartements.push(departement)
          filteredDepartementsCodes.push(departement.code)
        }
      }
    }

    setDepartements(filteredDepartements)
  }, [code, communes]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDepartements()
  }, [fetchDepartements])

  return (
    <Dropdown code={code} nom={nom} numberOfCommunes={foundCommunes.length} communes={foundCommunes}>
      {departements.map(departement => {
        const communesFoundByDepartement = foundCommunes.filter(commune => commune.codeDepartement.includes(departement.code))

        return (
          <Dropdown key={departement.code} numberOfCommunes={communesFoundByDepartement.length} {...departement} communes={communesFoundByDepartement} size='small' color='secondary'>
            {communesFoundByDepartement.map(commune => <Commune key={commune.codeCommune} {...commune} />)}
          </Dropdown>
        )
      })}
    </Dropdown>
  )
}

RegionDropdown.propTypes = {
  code: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  communes: PropTypes.array.isRequired
}

export default RegionDropdown
