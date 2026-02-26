'use client'

import React from 'react'

import ConnectionBox from './ConnectionBox'

function SignInBlock({ onConnect }: { onConnect?: (connectionStatus: boolean, data: Record<string, unknown>) => void }) {
  return (
    <div>
      <ConnectionBox
        teaser={`
          Connectez-vous pour acceder à votre espace personnel et
          gérer vos options, en tant qu'utilisateur de l'adresse,
          mandataire de collectivités, ou administrateur d'une commune.`}
        onConnect={() => {
          // Rediriger vers l'API de connexion ProConnect
          window.location.href = '/api/login?return_to=/admin'
        }}
      />
    </div>
  )
}

export default SignInBlock
