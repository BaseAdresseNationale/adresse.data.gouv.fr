import { useMemo } from 'react'

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button'

import {
  AsideFooterWrapper,
  ActionWrapper,
  ActionList,
} from './AsideFooter.styles'

interface AsideFooterAddressProps {
  children?: React.ReactNode
  actions?: {
    label: ButtonProps['children']
    onClick: ButtonProps['onClick']
    iconId: ButtonProps['iconId']
    priority?: ButtonProps['priority']
  }[]
}

function AsideFooterDistrict({ children, actions }: AsideFooterAddressProps) {
  const actionsButtons = useMemo(() => actions?.map(({ label, ...props }, index) => (
    <ActionList key={index}>
      <Button
        {...props as ButtonProps}
      >
        {label}
      </Button>
    </ActionList>
  )
  ), [actions])

  return (
    <AsideFooterWrapper>
      {children}
      {actions && actions.length > 0 && (
        <ActionWrapper>
          <ActionList>
            {actionsButtons}
          </ActionList>
        </ActionWrapper>
      )}
    </AsideFooterWrapper>
  )
}

export default AsideFooterDistrict
