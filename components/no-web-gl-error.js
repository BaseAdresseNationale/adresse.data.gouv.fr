import React from 'react'
import Notification from './notification'

const NoWebglError = () => (
  <Notification type='warning'>
    <div>
      <p>L’accélération matérielle n’est pas activée sur votre navigateur, or celle-ci est nécessaire à l’affichage de cette page.</p>
      <p>La plupart du temps cela signifie que vous utilisez un navigateur obsolète ou que cette fonctionnalité a été désactivée volontairement.</p>
      <p>Nous sommes désolés pour le désagrément. N’hésitez pas à <a href='mailto:adresse@data.gouv.fr'>nous contacter</a> pour plus d’informations.</p>
    </div>
  </Notification>
)

export default NoWebglError
