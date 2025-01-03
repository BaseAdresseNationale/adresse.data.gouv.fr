import React, { useState, useCallback } from 'react'
import Button, { type ButtonProps } from '@codegouvfr/react-dsfr/Button'

import { ActionMessage } from './ActionComponents.styles'

interface ActionButtonDisabledProps extends ButtonProps.IconOnly {
  title: string
  message?: React.ReactNode
  onClick?: (evt: HandleButtonDownloadEvent) => void
}

interface HandleButtonDownloadEvent extends React.MouseEvent<HTMLButtonElement> {}

function ActionButtonDisabled({ iconId, title, message, onClick, ...props }: ActionButtonDisabledProps) {
  const [isMessageVisible, setIsMessageVisible] = useState(false)
  const toogleMessage = useCallback(() => setIsMessageVisible(!isMessageVisible), [isMessageVisible])
  const handleOnClick = useCallback((evt: HandleButtonDownloadEvent) => {
    evt?.preventDefault()
    toogleMessage()
    onClick?.(evt)
  }
  , [onClick, toogleMessage])

  return (
    <span>
      <Button
        iconId={iconId}
        onClick={handleOnClick}
        priority="tertiary no outline"
        style={{ color: 'var(--text-disabled-grey)' }}
        {...props}
      >
        {title}
      </Button>
      {
        message && (
          <ActionMessage $isVisible={isMessageVisible}>
            {message}
          </ActionMessage>
        )
      }
    </span>

  )
}

export default ActionButtonDisabled
