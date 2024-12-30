import { useCallback, useEffect, useRef } from 'react'
import { fr } from '@codegouvfr/react-dsfr'

import AsideHeader from './AsideHeader'
import { useBanMapConfig } from '../../components/ban-map/BanMap.context'

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

const useDebouncedCallback = (callback: ((...args: any[]) => void), delay: number) => {
  const callbackRef = useRef(callback)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: any[]) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )
}

function Aside({
  children,
  header,
  footer,
  path,
  onClose,
  onClickToggler: onClickTogglerProps,
  isOpen = true,
  isInfo,
}: AsideProps | AsideInfoProps) {
  const debounceDelay = 10
  const asideWrapperRef = useRef<HTMLDivElement>(null)
  const asideBodyRef = useRef<HTMLDivElement>(null)

  const banMapConfigState = useBanMapConfig()
  const [banMapConfig, dispatchToBanMapConfig] = banMapConfigState
  const { displayMenuConfig } = banMapConfig

  const oldScrollTop = useRef(0)
  const handleScroll = useDebouncedCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const target = e.target as HTMLDivElement
      const windowWidth = window?.innerWidth || 0
      const isMobile = windowWidth < fr.breakpoints.getPxValues().md
      const isScrollUp = oldScrollTop.current > target.scrollTop
      oldScrollTop.current = target.scrollTop

      if (target.scrollTop <= 10) {
        dispatchToBanMapConfig({ type: 'TOOGLE_MENU_CONFIG', payload: true })
      }
      else if (!isMobile && isScrollUp) {
        dispatchToBanMapConfig({ type: 'TOOGLE_MENU_CONFIG', payload: true })
      }
      else {
        dispatchToBanMapConfig({ type: 'TOOGLE_MENU_CONFIG', payload: false })
      }
    },
    debounceDelay
  )

  interface OnClickTogglerArgs {
    isOpen: boolean
    togglerButtonType: 'horizontal' | 'vertical'
  }

  const onClickToggler = useCallback(
    (args: OnClickTogglerArgs) => {
      onClickTogglerProps?.(args)
      if (isOpen) {
        dispatchToBanMapConfig({ type: 'TOOGLE_MENU_CONFIG', payload: true })
      }
    },
    [dispatchToBanMapConfig, isOpen, onClickTogglerProps]
  )

  const onTargetClick = useCallback(() => {
    asideWrapperRef.current?.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (path) {
      asideWrapperRef.current?.scrollTo(0, 0)
      asideBodyRef.current?.scrollTo(0, 0)
    }
  }, [path])

  const withTogglerButton = Boolean(onClickToggler)

  return (
    <AsideWrapper
      ref={asideWrapperRef}
      $withTogglerButton={withTogglerButton}
      $withConfigMenuVisible={displayMenuConfig}
      $isOpen={isOpen}
      $isVisible={Boolean(children)}
      $isTypeInfo={isInfo}
      onScroll={handleScroll}
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

      <div className="aside-body-wrapper">
        <div
          ref={asideBodyRef}
          className="body"
          onScroll={handleScroll}
        >
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

          {footer && (
            <AsideFooter $isForLargeScreen>
              {footer}
            </AsideFooter>
          )}
        </div>
        {footer && (
          <AsideFooter $onTargetClick={onTargetClick} $isForSmallScreen>
            {footer}
          </AsideFooter>
        )}
      </div>
    </AsideWrapper>
  )
}

export default Aside
