import React from 'react'
import styles from './ProConnectButtonCustom.module.css'

interface ProConnectButtonCustomProps {
  loginUrl: string
}

const ProConnectButtonCustom: React.FC<ProConnectButtonCustomProps> = ({ loginUrl }) => {
  const renderProConnectInfo = () => (
    <p>
      <a
        href="https://www.proconnect.gouv.fr/"
        target="_blank"
        rel="noopener noreferrer"
        title="Qu’est-ce que ProConnect ? - nouvelle fenêtre"
      >
        Qu’est-ce que ProConnect ?
      </a>
    </p>
  )

  return (
    <>
      <div>
        <form action={loginUrl} method="post">
          <button className={styles.proconnectButton}>
            <span className={styles.proconnectSrOnly}>S’identifier avec ProConnect</span>
          </button>
        </form>
        {renderProConnectInfo()}
      </div>
    </>
  )
}

export default ProConnectButtonCustom
