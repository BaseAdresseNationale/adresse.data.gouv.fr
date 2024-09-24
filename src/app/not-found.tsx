import ErrorLayout from './error-layout'

export default function NotFound() {
  return (
    <ErrorLayout
      title="Erreur 404"
      subTitle="Page non trouvée"
      imgSrc="/img/page_not_found.svg"
      imgAlt="Erreur 404"
    >
      <p>
        La page que vous cherchez est introuvable.<br />
        Excusez-nous pour la gène occasionnée.
      </p>
      <p>
        Si vous avez tapé l’adresse web dans le navigateur, vérifiez qu’elle est correcte.<br />
        Il est egalement possible que la page ne soit plus disponible. Dans ce cas, pour continuer votre visite, vous pouvez consulter notre page d’accueil.
      </p>
    </ErrorLayout>
  )
}
