import PropTypes from 'prop-types'
import {Edit2} from 'react-feather'

import Section from '@/components/section'
import BalAnomalies from './bal-anomalies'
import ButtonLink from '@/components/button-link'

function BalQuality({currentRevision, communeName, codeCommune}) {
  return (
    <Section background='grey' title='Qualité des adresses' subtitle='Liste des principales anomalies'>
      {currentRevision ? (
        <BalAnomalies errors={currentRevision.validation.errors} communeName={communeName} codeCommune={codeCommune} />
      ) : (
        <div className='unavailable-container'>
          <p>La commune de {communeName} ne dispose d‘aucune Base Adresse Locale.</p>

          <ButtonLink
            isExternal
            size='large'
            target='_blank'
            rel='noreferrer'
            href='https://mes-adresses.data.gouv.fr/new'
          >
            Créer votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} />
          </ButtonLink>
        </div>
      )}

      <style jsx>{`
        .unavailable-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3em;
          margin-top: 3em;
        }

        p {
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </Section>
  )
}

BalQuality.propTypes = {
  currentRevision: PropTypes.object,
  communeName: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired
}

BalQuality.defaultTypes = {
  currentRevision: null
}

export default BalQuality
