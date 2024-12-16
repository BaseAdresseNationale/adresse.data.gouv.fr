import AsideHeader from './AsideHeader'

import {
  AsideWrapper,
  AsideTogglerButtonWrapper,
  AsideWrapperTogglerButton,
  AsideBody,
  AsideFooter,
} from './Aside.styles'

import type { MapBreadcrumbPath } from '../MapBreadcrumb'

interface AsideDefaultProps {
  children: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  path?: MapBreadcrumbPath
  onClose?: () => void
  onClickToggler?: (args: { isOpen: boolean, togglerButtonType: 'horizontal' | 'vertical' }) => void
  isOpen?: boolean
  isInfo?: boolean
}

interface AsideProps extends AsideDefaultProps {
  header: React.ReactNode
  isInfo?: false
}
interface AsideInfoProps extends AsideDefaultProps {
  header?: undefined | null
  isInfo: true
}

function Aside({
  children,
  header,
  footer,
  path,
  onClose,
  onClickToggler,
  isOpen = true,
  isInfo,
}: AsideProps | AsideInfoProps) {
  const withTogglerButton = Boolean(onClickToggler)

  return (
    <AsideWrapper
      $isOpen={isOpen}
      $isVisible={Boolean(children)}
      $withTogglerButton={withTogglerButton}
      $isTypeInfo={isInfo}
    >
      {withTogglerButton && (
        <AsideTogglerButtonWrapper>
          <AsideWrapperTogglerButton
            className="ri-arrow-right-double-fill md"
            onClick={() => {
              onClickToggler?.({
                isOpen,
                togglerButtonType: 'horizontal',
              })
            }}
            $isOpen={isOpen}
          />
        </AsideTogglerButtonWrapper>
      )}

      <div className="aside-body-wrapper ">
        <div className="body">
          {header && (
            <AsideHeader path={path} onClose={onClose}>
              {header}
            </AsideHeader>
          )}

          {isInfo
            ? children
            : children && (
              <AsideBody>
                {children}
              </AsideBody>
            )}
        </div>
        {footer && (
          <AsideFooter>
            {footer}
          </AsideFooter>
        )}
      </div>
    </AsideWrapper>
  )
}

export default Aside
