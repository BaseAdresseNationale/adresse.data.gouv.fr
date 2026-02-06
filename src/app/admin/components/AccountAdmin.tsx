import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const AdminContentWrapper = styled.div`
  /* list-style: none;
  padding: 0;
  margin: 1.5rem 0; */

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h4 + .fr-hint-text {
    margin-top: -2em;
  }
`

function AccountAdmin() {
  return (
    <AdminContentWrapper>
      <section>
        <h4>Communes favorites</h4>
        <p className="fr-hint-text">{' '}
          Conservez une liste de communes que vous souhaitez suivre de près.
        </p>
        <p>
          Obtenir en un clin d’œil l’état de publication des Bases Adresses Locales
          de vos communes favorites depuis votre tableau de bord.
        </p>
      </section>

      <section>
        <h4>Notifications</h4>
        <p className="fr-hint-text">{' '}
          Gérez vos abonnements aux alertes BAN.
        </p>
        <p>
          Recevez des alertes automatiques à la publication d&apos;une Base Adresse Locale,
          avec l&apos;identification des anomalies si la BAL doit être corrigée puis republiée.
          Surveillez les erreurs de format, données manquantes et
          autres blocages sur les communes qui vous intéressent.<br />
          En savoir plus sur les{' '}
          <Link href="/outils/notifications-ban" target="_blank" rel="noopener noreferrer">
            notifications BAN
          </Link>.
        </p>
      </section>

      <section>
        <h4>Jeton API</h4>
        <p className="fr-hint-text">{' '}
          Générez et gérez vos jetons API pour accéder aux services de la Base Adresse Nationale.
        </p>
        <p>
          Pour les developpeurs d&apos;applications et services utilisant
          les données de la Base Adresse Nationale,
          nos API HTTP/REST sont librement accessibles.
          Le nombre de requêtes sur ces API est volontairement limité
          afin de garantir la qualité de service pour tous les utilisateurs.<br />
          Pour des usages plus intensifs, un jeton API vous est nécessaire.
        </p>
      </section>
    </AdminContentWrapper>
  )
}

export default AccountAdmin
