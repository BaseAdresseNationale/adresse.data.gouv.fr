import PropTypes from 'prop-types'

import Section from '@/components/section'
import BalAlerts from './bal-alerts'

function BalQuality({currentRevision, typeComposition}) {
  const errors = currentRevision && currentRevision.validation.errors ? currentRevision.validation.errors : []
  const warnings = currentRevision && currentRevision.validation.warnings ? currentRevision.validation.warnings : []
  const infos = currentRevision && currentRevision.validation.infos ? currentRevision.validation.infos : []

  return (
    <Section background='grey' title='Qualité des adresses' subtitle='Liste des types d’alertes détectés dans la BAL'>
      {typeComposition === 'bal' ? (
        <BalAlerts errors={errors} warnings={warnings} infos={infos} />
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
