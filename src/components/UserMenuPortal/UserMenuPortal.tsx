'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import UserMenuPopover from '@/components/UserMenuPopover/UserMenuPopover'

interface UserMenuPortalProps {
  displayName?: string
  userEmail?: string
  organization?: string
  accountUrl: string
  logoutUrl: string
}

const MenuItem = styled.li`
  list-style: none;
`

const MenuButton = styled.button.attrs({
  className: 'fr-btn fr-icon-account-circle-fill',
})`
  cursor: pointer;
`

export default function UserMenuPortal({
  displayName,
  userEmail,
  organization,
  accountUrl,
  logoutUrl,
}: UserMenuPortalProps) {
  const [container, setContainer] = useState<Element | null>(null)
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const el = document.querySelector('.fr-header__tools-links .fr-btns-group')
    setContainer(el)
  }, [])

  const content = useMemo(() => {
    if (!container) return null
    return (
      <MenuItem>
        <MenuButton
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls="user-menu-popover"
        >
          Mon espace
        </MenuButton>
        <UserMenuPopover
          open={open}
          anchorRef={buttonRef}
          onClose={() => setOpen(false)}
          displayName={displayName}
          userEmail={userEmail}
          organization={organization}
          accountUrl={accountUrl}
          logoutUrl={logoutUrl}
        />
      </MenuItem>
    )
  }, [accountUrl, container, displayName, logoutUrl, open, userEmail])

  if (!container) return null
  return createPortal(content, container)
}
