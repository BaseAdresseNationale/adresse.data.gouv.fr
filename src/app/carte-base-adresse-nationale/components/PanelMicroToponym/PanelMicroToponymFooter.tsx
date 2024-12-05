import { useFocusOnMap } from '../ban-map/BanMap.context'

import Button from '@codegouvfr/react-dsfr/Button'

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
}

function PanelMicroToponymFooter({ banItem: microToponym, children }: PanelMicroToponymFooterProps) {
  const focusOnMap = useFocusOnMap(microToponym)

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    focusOnMap()
  }

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
