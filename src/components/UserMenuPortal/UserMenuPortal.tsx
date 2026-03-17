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
  
  &::after {
    content: "";
    display: inline-block;
    vertical-align: middle;
    width: 1rem;
    height: 1rem;
    background-color: currentColor;
    mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-position: center;
    margin-left: 0.5rem;
    transition: transform 0.3s;
  }

  &[aria-expanded="true"]::after {
    transform: rotate(180deg);
  }
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
  }, [accountUrl, container, displayName, logoutUrl, open, userEmail, organization])

  if (!container) return null
  return createPortal(content, container)
}
