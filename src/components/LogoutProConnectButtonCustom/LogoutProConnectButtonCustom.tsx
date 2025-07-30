'use client'
import React from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { usePathname } from 'next/navigation'

interface LogoutProConnectButtonCustomProps {
  text: string
  loginUrl: string
}

const LogoutProConnectButtonCustom: React.FC<LogoutProConnectButtonCustomProps> = ({ text, loginUrl }) => {
  const pathname = usePathname()

  const handleLogout = () => {
    const currentPath = pathname || '/'
    const logoutUrl = `${loginUrl}?returnUrl=${encodeURIComponent(currentPath)}`
    window.location.href = logoutUrl
  }

  return (
    <div>
      <Button type="button" onClick={handleLogout}>
        {text}
      </Button>
    </div>
  )
}

export default LogoutProConnectButtonCustom
