import {useState, useMemo, useEffect} from 'react'
import {getFilteredStats} from '@/lib/api-ban'
import {getEpciCommunes, getDepartementCommunes} from '@/lib/api-geo'
import {DEFAULT_CENTER, DEFAULT_ZOOM} from '@/components/maplibre/map'

function toCounterData(percent, total) {
  return {
    labels: [],
    datasets: [
      {
        data: [percent, total],
        backgroundColor: [
          'rgba(0, 83, 179, 1)',
          'rgba(0, 0, 0, 0)'
        ],
        borderColor: [
          'rgba(1, 1, 1, 0)',
          'rgba(1, 1, 1, 0.3)'
        ],
        borderWidth: 1,
      },
    ]
  }
}

function estimateZoomFromContour(contour, maxZoomLevel) {
  const contourCoordonates = contour?.coordinates[0]

  if (!contourCoordonates || contourCoordonates.length < 4) {
    return maxZoomLevel
  }

  // We take four points in the shape
  const a = contourCoordonates[0]
  const b = contourCoordonates[Math.floor(contourCoordonates.length / 2)]
  const c = contourCoordonates[Math.floor(contourCoordonates.length / 4)]
  const d = contourCoordonates[3 * Math.floor(contourCoordonates.length / 4)]

  // Pythagore to compute the distance between ab and cd
  const distanceAB = Math.sqrt((Math.abs(b[0] - a[0]) ** 2) + (Math.abs(b[1] - a[1]) ** 2))
  const distanceCD = Math.sqrt((Math.abs(d[0] - c[0]) ** 2) + (Math.abs(d[1] - c[1]) ** 2))

  const biggestDistance = distanceAB > distanceCD ? distanceAB : distanceCD

  if (biggestDistance > 0 && biggestDistance < 0.4) {
    return maxZoomLevel
  }

  if (biggestDistance > 0.4 && biggestDistance < 0.7) {
    return maxZoomLevel - 1
  }

  return maxZoomLevel - 2
}

export function useStatsDeploiement({initialStats}) {
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState(initialStats)
  const [filter, setFilter] = useState(null)
  const [filteredCodesCommmune, setFilteredCodesCommune] = useState([])
  const [geometry, setGeometry] = useState({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM
  })

  useEffect(() => {
    async function updateStats() {
      setIsLoading(true)
      try {
        let filteredCommunes = []
        if (filter.type === 'EPCI') {
          filteredCommunes = await getEpciCommunes(filter.value)
          setGeometry({
            center: filter.center.coordinates,
            zoom: estimateZoomFromContour(filter.contour, 10)
          })
        } else if (filter.type === 'Département') {
          filteredCommunes = await getDepartementCommunes(filter.value)
          setGeometry({
            center: filter.center.coordinates,
            zoom: 8
          })
        }

        const filteredCodesCommmune = filteredCommunes.map(({code}) => code)
        setFilteredCodesCommune(filteredCodesCommmune)
        const filteredStats = await getFilteredStats(filteredCodesCommmune)

        setStats(filteredStats)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (filter === null) {
      setStats(initialStats)
      setGeometry({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM
      })
      setFilteredCodesCommune([])
    } else {
      updateStats()
    }
  }, [filter, initialStats])

  const formatedStats = useMemo(() => {
    const total = stats.total || stats.france

    // Calcul population couverte
    const populationCouvertePercent = Math.round((stats.bal.populationCouverte * 100) / total.population)
    const allPopulationCouverte = 100 - Math.round((stats.bal.populationCouverte * 100) / total.population)
    const dataPopulationCouverte = toCounterData(populationCouvertePercent, allPopulationCouverte)

    // Calcul communes couvertes
    const communesCouvertesPercent = Math.round((stats.bal.nbCommunesCouvertes * 100) / total.nbCommunes)
    const allCommunesCouvertesPercent = 100 - Math.round((stats.bal.nbCommunesCouvertes * 100) / total.nbCommunes)
    const dataCommunesCouvertes = toCounterData(communesCouvertesPercent, allCommunesCouvertesPercent)

    // Calcul adresses gerees dans la BAL
    const adressesGereesBALPercent = Math.round((stats.bal.nbAdresses * 100) / stats.ban.nbAdresses)
    const allAdressesGereesBALPercent = 100 - Math.round((stats.bal.nbAdresses * 100) / stats.ban.nbAdresses)
    const dataAdressesGereesBAL = toCounterData(adressesGereesBALPercent, allAdressesGereesBALPercent)

    // Calcul adresses certifiees
    const adressesCertifieesPercent = Math.round((stats.bal.nbAdressesCertifiees * 100) / stats.ban.nbAdresses)
    const allAdressesCertifieesPercent = 100 - Math.round((stats.bal.nbAdressesCertifiees * 100) / stats.ban.nbAdresses)
    const dataAdressesCertifiees = toCounterData(adressesCertifieesPercent, allAdressesCertifieesPercent)

    return {
      populationCouvertePercent,
      allPopulationCouverte,
      dataPopulationCouverte,
      communesCouvertesPercent,
      allCommunesCouvertesPercent,
      dataCommunesCouvertes,
      adressesGereesBALPercent,
      allAdressesGereesBALPercent,
      dataAdressesGereesBAL,
      adressesCertifieesPercent,
      allAdressesCertifieesPercent,
      dataAdressesCertifiees,
      total
    }
  }, [stats])

  return {
    stats,
    geometry,
    formatedStats,
    filter,
    setFilter,
    filteredCodesCommmune,
    isLoading,
  }
}
