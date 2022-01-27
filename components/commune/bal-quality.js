import PropTypes from 'prop-types'

import Section from '@/components/section'
import BalAnomalies from './bal-anomalies'

function BalQuality({currentRevision, typeComposition}) {
  return (
    <Section background='grey' title='Qualité des adresses' subtitle='Liste des principales anomalies'>
      {typeComposition === 'bal' ? (
        <BalAnomalies errors={currentRevision.validation.errors} />
      ) : (
        <p>Retrouvez bientôt la qualité des adresses La Base Adresse Locale de la commune.</p>
      )}

      <style jsx>{`
        p {
          font-style: italic;
          text-align: center;
        }
      `}</style>
    </Section>
  )
}

BalQuality.propTypes = {
  currentRevision: PropTypes.object,
  typeComposition: PropTypes.string.isRequired
}

BalQuality.defaultTypes = {
  currentRevision: null
}

export default BalQuality
