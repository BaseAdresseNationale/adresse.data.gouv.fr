import React from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

interface LogoutProConnectButtonCustomProps {
  text: string
  loginUrl: string
}

const LogoutProConnectButtonCustom: React.FC<LogoutProConnectButtonCustomProps> = ({ text, loginUrl }) => {
  return (
    <>
      <div>
        <form action={loginUrl} method="post">
          <Button>{text}</Button>
        </form>
      </div>
    </>
  )
}

export default LogoutProConnectButtonCustom
