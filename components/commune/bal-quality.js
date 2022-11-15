import PropTypes from 'prop-types'
import {pick} from 'lodash'

import Section from '@/components/section'
import BalAlerts from './bal-alerts'

function BalQuality({currentRevision}) {
  const harvestErrors = pick(currentRevision?.context.extras, 'uniqueErrors', 'nbRowsWithErrors')
  const errors = harvestErrors.uniqueErrors || []
  const warnings = currentRevision?.validation.warnings ? currentRevision.validation.warnings : []
  const infos = currentRevision?.validation.infos ? currentRevision.validation.infos : []

  return (
    <Section background='grey' title='Qualité des adresses' subtitle='Liste des types d’alertes détectés dans la Base Adresse Locale'>
      {currentRevision ? (
        <BalAlerts
          errors={errors}
          nbRowsWithErrors={harvestErrors.nbRowsWithErrors}
          warnings={warnings}
          infos={infos}
        />
      ) : (
        <p>Retrouvez bientôt des informations concernant la qualité de la Base Adresse Locale de la commune.</p>
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
  currentRevision: PropTypes.object
}

BalQuality.defaultTypes = {
  currentRevision: null
}

export default BalQuality
