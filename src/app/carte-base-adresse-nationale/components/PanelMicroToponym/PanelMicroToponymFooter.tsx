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
  isMenuVisible?: boolean
}

function PanelMicroToponymFooter({ banItem: microToponym, children, isMenuVisible }: PanelMicroToponymFooterProps) {
  const focusOnMap = useFocusOnMap(microToponym)

  const handleClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    const options = { padding: isMenuVisible ? { top: 30, bottom: 30, left: 400 * 1.5, right: 400 / 2 } : 30 }
    focusOnMap(options)
  }, [focusOnMap, isMenuVisible])

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
