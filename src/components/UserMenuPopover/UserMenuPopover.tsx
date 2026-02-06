'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

interface UserMenuPopoverProps {
  open: boolean
  anchorRef: React.RefObject<HTMLElement>
  onClose: () => void
  displayName?: string
  userEmail?: string
  organization?: string
  accountUrl: string
  logoutUrl: string
}

const Popover = styled.div`
  position: fixed;
  z-index: 1000;
  min-width: 240px;
  max-width: 320px;
  background: var(--background-default-grey);
  border: 1px solid var(--border-default-grey);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
`

const UserInfo = styled.div`
  padding: 0.75rem 1rem;
  background: var(--background-alt-blue-france);
  border-bottom: 1px solid var(--border-default-grey);
`

const UserName = styled.div`
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--text-title-grey);
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--text-mention-grey);
  word-break: break-word;
`

const UserOrganization = styled.div`
  font-size: 0.75rem;
  color: var(--text-default-grey);
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;

  &::before {
    content: "";
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: currentColor;
    -webkit-mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M21 19h2v2H1v-2h2V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15h2V9h3a1 1 0 0 1 1 1v9zM7 11v2h4v-2H7zm0-4v2h4V7H7z'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M21 19h2v2H1v-2h2V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v15h2V9h3a1 1 0 0 1 1 1v9zM7 11v2h4v-2H7zm0-4v2h4V7H7z'/%3E%3C/svg%3E");
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
  }
`

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0.25rem 0;
  max-height: 220px;
  overflow-y: auto;
`

const MenuItem = styled.li`
  margin: 0;
`

const MenuLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  color: inherit;
  text-decoration: none;
  font-size: 0.875rem;

  &:hover {
    background: var(--background-action-low-blue-france-hover);
    text-decoration: none;
  }
`

export default function UserMenuPopover({
  open,
  anchorRef,
  onClose,
  displayName,
  userEmail,
  organization,
  accountUrl,
  logoutUrl,
}: UserMenuPopoverProps) {
  const [position, setPosition] = useState<{ top: number, left: number } | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const hasUserInfo = useMemo(() => Boolean(displayName || userEmail || organization), [displayName, userEmail, organization])

  useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const minWidth = 240
    const left = Math.min(
      Math.max(8, rect.right - minWidth),
      window.innerWidth - minWidth - 8
    )
    const top = rect.bottom + 8
    setPosition({ top, left })

    const handleResize = () => {
      const nextRect = anchor.getBoundingClientRect()
      const nextLeft = Math.min(
        Math.max(8, nextRect.right - minWidth),
        window.innerWidth - minWidth - 8
      )
      const nextTop = nextRect.bottom + 8
      setPosition({ top: nextTop, left: nextLeft })
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (anchor.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      onClose()
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('resize', handleResize)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [anchorRef, onClose, open])

  if (!open || !position) return null

  return (
    <Popover
      id="user-menu-popover"
      role="menu"
      ref={popoverRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      {hasUserInfo && (
        <UserInfo>
          {displayName && <UserName>{displayName}</UserName>}
          {userEmail && <UserEmail>{userEmail}</UserEmail>}
          {organization && <UserOrganization>{organization}</UserOrganization>}
        </UserInfo>
      )}
      <MenuList>
        <MenuItem>
          <MenuLink
            href={accountUrl}
            onClick={onClose}
            className="fr-link fr-link--icon-left fr-icon-user-line"
          >
            Mon compte
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink
            href={logoutUrl}
            onClick={onClose}
            className="fr-link fr-link--icon-left fr-icon-arrow-right-line"
          >
            Se déconnecter
          </MenuLink>
        </MenuItem>
      </MenuList>
    </Popover>
  )
}
