'use client'

import React from 'react'

import ConnectionBox from './ConnectionBox'

function SignInBlock({onConnect}: {onConnect?: (connectionStatus: boolean, data: Record<string, unknown>) => void  }) {
    const connectUser = (connectionStatus: boolean) => {
    if (connectionStatus) {
      // TODO : Handle successful connection logic here
    } else {
      // TODO : Handle disconnection logic here
    }
    if (onConnect) {
      onConnect(connectionStatus, {})
    }
  }

  return (
    <div>
      <ConnectionBox
        teaser={`
          Connectez-vous pour acceder à votre espace personnel et
          gérer vos options, en tant qu'utilisateur de l'adresse,
          mandataire de collectivités, ou administrateur d'une commune.`}
        onConnect={(connectionStatus: boolean) => connectUser(connectionStatus)}
      />
    </div>
  )
}

export default SignInBlock
