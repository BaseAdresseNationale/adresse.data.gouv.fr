import {
  AsideWrapper,
  AsideTogglerButtonWrapper,
  AsideWrapperTogglerButton,
  AsideFooter,
} from './Aside.styles'

interface AsideProps {
  children: React.ReactNode
  footer?: React.ReactNode
  onClickToggler?: (args: { isOpen: boolean, togglerButtonType: 'horizontal' | 'vertical' }) => void
  isOpen?: boolean
  isInfo?: boolean
}

function Aside({ children, footer, onClickToggler, isOpen = true, isInfo }: AsideProps) {
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
            className="ri-arrow-up-double-fill sm"
            // TODO : Add onClick event for auto scroll to top on mobile
            onClick={() => {
              onClickToggler?.({
                isOpen,
                togglerButtonType: 'vertical',
              })
            }}
            $isOpen={isOpen}
          />

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

      <div className="body">
        {children}

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
