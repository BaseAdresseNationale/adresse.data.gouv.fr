import Button from '@codegouvfr/react-dsfr/Button'

import MapBreadcrumb from '../MapBreadcrumb'
import type { MapBreadcrumbPath } from '../MapBreadcrumb'

import {
  AsideHeader as AsideHeaderStyle,
  AsideHeaderContent,
  AsideHeaderCloseButtonWrapper,
} from './AsideHeader.styles'

interface AsideHeaderProps {
  path?: MapBreadcrumbPath
  children?: React.ReactNode
  onClose?: () => void
}

function AsideHeader({ path, children, onClose }: AsideHeaderProps) {
  return (
    <AsideHeaderStyle>
      {path && <MapBreadcrumb path={path} />}
      <AsideHeaderContent>
        {onClose && (
          <AsideHeaderCloseButtonWrapper>
            <Button
              iconId="ri-close-line"
              priority="tertiary no outline"
              size="small"
              onClick={onClose}
              title="Fermer"
            />
          </AsideHeaderCloseButtonWrapper>
        )}
        {children}
      </AsideHeaderContent>
    </AsideHeaderStyle>
  )
}

export default AsideHeader
