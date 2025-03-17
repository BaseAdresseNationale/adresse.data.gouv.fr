import { useCallback } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

import { useFocusOnMap } from '../ban-map/BanMap.context'
import {
  AsideFooterWrapper,
  ActionWrapper,
  ActionList,
} from './PanelMicroToponymFooter.styles'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface PanelMicroToponymFooterProps {
  banItem: TypeMicroToponymExtended
  withCertificate: boolean
  children?: React.ReactNode
  onClickAction?: (actionName?: string) => void
}

function PanelMicroToponymFooter({ banItem: microToponym, children, onClickAction }: PanelMicroToponymFooterProps) {
  const focusOnMap = useFocusOnMap(microToponym)

  const handleClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    focusOnMap()
    if (onClickAction) onClickAction()
  }, [focusOnMap, onClickAction])

  return (
    <AsideFooterWrapper>
      {children}
      <ActionWrapper>
        <ActionList>
          <Button
            iconId="ri-focus-3-line"
            onClick={handleClick}
            priority="tertiary no outline"
          >
            Centrer la carte sur l’odonyme
          </Button>

        </ActionList>
      </ActionWrapper>
    </AsideFooterWrapper>
  )
}

export default PanelMicroToponymFooter
