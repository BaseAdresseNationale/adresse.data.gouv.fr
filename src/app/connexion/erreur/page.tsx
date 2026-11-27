import ErrorLayout from '@/app/error-layout'
import pageTitle from '@/utils/pageTitle'

export const metadata = pageTitle('Connexion impossible')

export default function LoginErrorPage() {
  return (
    <ErrorLayout
      title="Connexion impossible"
      subTitle="La connexion avec ProConnect n’a pas abouti"
      imgSrc="/img/page_not_found.svg"
      imgAlt=""
    >
      <p>Nous n’avons pas pu ouvrir votre session. Vous pouvez réessayer dans quelques instants.</p>
      {/* Lien classique : `/api/login` est une route serveur qui redirige vers ProConnect. Classes `fr-link` à la main : le DSFR n'a pas de composant lien, son `Button` rend un `fr-btn`. */}
      <p>
        <a className="fr-link fr-icon-arrow-right-line fr-link--icon-right" href="/api/login">
          Se reconnecter
        </a>
      </p>
    </ErrorLayout>
  )
}
