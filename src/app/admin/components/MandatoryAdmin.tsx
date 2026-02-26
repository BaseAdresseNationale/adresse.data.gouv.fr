import React from 'react'
import { Alert } from '@codegouvfr/react-dsfr/Alert'

function MandatoryAdmin() {
  return (
    <div className="fr-container--fluid">
      <Alert
        severity="info"
        title="Espace Mes mandats"
        description="Cet espace est réservé aux mandataires (EPCI, Départements, etc.) souhaitant gérer les communes de leur périmètre. Cette fonctionnalité sera disponible prochainement."
      />
    </div>
  )
}

export default MandatoryAdmin
