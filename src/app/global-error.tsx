'use client'

import { useEffect } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import ErrorLayout from './error-layout'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorLayout
      title="Erreur"
      subTitle="Erreur inattendue"
      imgSrc="/img/global-error.svg"
      imgAlt="Illustration d’erreur"
    >
      <p>
        Une erreur inattendue est survenue.<br />
        Excusez-nous pour la gêne occasionnée.
      </p>
      <p>
        Vous pouvez consulter notre page d’accueil. <br />
        Si le problème persiste, vous pouvez contacter notre support technique.
      </p>
      <p>
        <Button type="button" priority="primary" onClick={reset}>
          Recharger la page
        </Button>
      </p>
    </ErrorLayout>
  )
}
