import { useFocusOnMap } from '../ban-map/BanMap.context'

import Button from '@codegouvfr/react-dsfr/Button'

import {
  AsideFooterWrapper,
  ActionWrapper,
  ActionList,
} from './AsideFooterDistrict.styles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

interface AsideFooterAddressProps {
  banItem: TypeDistrictExtended
  withCertificate: boolean
  children?: React.ReactNode
}

function AsideFooterDistrict({ banItem: microToponym, children }: AsideFooterAddressProps) {
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
            Centrer la carte sur la commune
          </Button>

        </ActionList>
      </ActionWrapper>
    </AsideFooterWrapper>
  )
}

export default AsideFooterDistrict
