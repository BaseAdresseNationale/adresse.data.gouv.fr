'use client'

import ErrorLayout from './error-layout'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorLayout
      title={`Erreur ${error || '500'}`}
      subTitle="Erreur inattendue"
      imgSrc="/img/global-error.svg"
      imgAlt={`Erreur ${error || '500'}`}
    >
      <p>
        Une erreur inattendue est survenue.<br />
        Excusez-nous pour la gène occasionnée.
      </p>
      <p>
        Vous pouvez consulter notre page d’accueil. <br />
        Si le problème persiste, vous pouvez contacter notre support technique.
      </p>
      {reset && (
        <p>
          <button onClick={reset}>Recharger la page</button>
        </p>
      )}
    </ErrorLayout>
  )
}
