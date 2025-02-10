import Button from '@codegouvfr/react-dsfr/Button'

import {
  AsideHeaderWrapper,
  AsideHeaderContent,
  AsideHeaderCloseButtonWrapper,
} from './AsideHeader.styles'

interface AsideHeaderProps {
  children?: React.ReactNode
  onClose?: () => void
}

function AsideHeader({ children, onClose }: AsideHeaderProps) {
  return (
    <AsideHeaderWrapper>
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
    </AsideHeaderWrapper>
  )
}

export default AsideHeader
