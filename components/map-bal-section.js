import PropTypes from 'prop-types'
import Image from 'next/image'

import {numFormater} from '@/lib/format-numbers'

import theme from '@/styles/theme'

import ButtonLink from '@/components/button-link'
import Metric from '@/components/metric'

function MapBalSection({stats}) {
  const populationCouvertePercent = Math.round((stats.bal.populationCouverte * 100) / stats.france.population)

  return (
    <div className='deployement-container'>
      <div className='map-illustration'>
        <div className='map-illustration'>
          <Image src='/images/france-illustration.svg' layout='responsive' height={400} width={400} alt aria-hidden />
        </div>
      </div>
      <div className='metrics-container'>
        <Metric metric={stats.bal.nbCommunesCouvertes}> communes couvertes</Metric>
        <Metric metric={numFormater(stats.bal.nbAdresses)}> d’adresses issues des BAL</Metric>
        <Metric metric={populationCouvertePercent} isPercent>de la population couverte</Metric>
      </div>
      <ButtonLink href='/deploiement-bal' isOutlined color='white'>Accéder à la carte de couverture des Bases Adresses Locales</ButtonLink>

      <style jsx>{`
        .deployement-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3em;
          margin-top: 3em;
        }

        .map-illustration {
          min-width: 290px;
          max-width: 400px;
        }

        .metrics-container {
          width: 100%;
          display: grid;
          justify-content: center;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          padding: 1em;
          gap: 3em;
          text-align: center;
          background: ${theme.colors.white};
          color: ${theme.darkText};
          border-radius: ${theme.borderRadius};
        }
      `}</style>
    </div>
  )
}

MapBalSection.propTypes = {
  stats: PropTypes.shape({
    france: PropTypes.object.isRequired,
    bal: PropTypes.object.isRequired,
    ban: PropTypes.object.isRequired
  }).isRequired
}
export default MapBalSection
