import { useCallback } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

import { useFocusOnMap } from '../ban-map/BanMap.context'
import {
  AsideFooterWrapper,
  ActionWrapper,
  ActionList,
} from './PanelDistrictFooter.styles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface PanelDistrictFooterProps {
  banItem: TypeDistrictExtended
  withCertificate: boolean
  children?: React.ReactNode
  onClickAction?: () => void
}

function PanelDistrictFooter({ banItem: microToponym, children, onClickAction }: PanelDistrictFooterProps) {
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
            Centrer la carte sur la commune
          </Button>

        </ActionList>
      </ActionWrapper>
    </AsideFooterWrapper>
  )
}

export default PanelDistrictFooter
