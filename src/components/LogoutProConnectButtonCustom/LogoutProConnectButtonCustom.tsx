'use client'
import React from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { usePathname } from 'next/navigation'
import { logout } from '@/utils/logout'

interface LogoutProConnectButtonCustomProps {
  text: string
}

const LogoutProConnectButtonCustom: React.FC<LogoutProConnectButtonCustomProps> = ({ text }) => {
  const pathname = usePathname()

  const handleLogout = () => {
    void logout({ returnUrl: pathname || '/' })
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
