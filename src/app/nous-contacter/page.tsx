'use client'

import Section from '@/components/Section'
import BALWidgetContext from '@/contexts/BALWidget.context'
import Button from '@codegouvfr/react-dsfr/Button'
import { useContext } from 'react'
import styled from 'styled-components'

const StyledWrapper = styled(Section)`
  > section {
    margin-bottom: 2rem;

    h2 {
      font-size: 1.5rem;
    }

    .osmose-buttons {
      display: flex;
      gap: 1rem;
    }

    a::after {
      display: none;
    }
  }
`

export default function NousContacterPage() {
  const { open, navigate } = useContext(BALWidgetContext)

  const handleContactParticuliers = () => {
    navigate('/particulier')
    open()
  }

  return (
    <StyledWrapper pageTitle="Nous contacter">
      <section>
        <h2>
          Je suis un particulier ou une entreprise et j’ai constaté une adresse manquante ou incorrecte.
        </h2>
        <p>
          La gestion des adresses est une compétence des communes. <b>Vous devez vous adresser à votre mairie</b>, et le cas échéant lui indiquer l’existence de ce site.
        </p>
      </section>
      <section>
        <h2>
          Je suis une commune ou un EPCI et je veux gérer les adresses de mon territoire pour améliorer la qualité des services apportés à mes administrés.
        </h2>
        <p>
          La gestion des adresses est la compétence des communes, mais elle est quelque fois exercée avec le soutien technique d’un EPCI.
        </p>
        <p>
          Cette gestion est simplifiée par l’existence d’outils officiels et gratuits, tels que <a target="_blank" href="https://mes-adresses.data.gouv.fr/">Mes Adresses</a>.
        </p>
        <p>
          Vous pouvez en quelques clics créer la Base Adresse Locale de votre commune, y apporter des modifications, et publier les changements pour que ceux-ci soient pris en compte par un maximum d’acteurs. La prise en main est très simple, et ne nécessite pas de compétences informatiques particulières.
        </p>
        <a href="/programme-bal" className="fr-link">Votre commune et la base adresse locale</a>
      </section>
      <section>
        <h2>
          Pour toute autre demande ou pour plus d’informations.
        </h2>
        <p>
          Si vous ne trouvez pas les réponses à vos questions sur ce site ou dans la documentation ou la FAQ, vous pouvez nous contacter à l’adresse suivante : adresse@data.gouv.fr.
        </p>
        <p>
          Notre équipe fera le nécessaire pour vous répondre dans les plus brefs délais, dans la limite de sa disponibilité.
        </p>
        <Button iconId="fr-icon-mail-line" onClick={handleContactParticuliers}>Nous contacter</Button>
      </section>
      <section>
        <h2>
          En tant qu’utilisateur des données, rejoignez Osmose
        </h2>
        <p>
          Osmose est l&apos;outil d&apos;animation et de support de la démarche Adresse_Lab, instance de concertation et de co-construction sur les évolutions de la Base Adresse Nationale.
        </p>
        <p>
          Il s&apos;adresse aux utilisateurs de la donnée BAN : administrations et services publics, services de secours et de sécurité, opérateurs de réseaux, services de localisation et navigation, ... constitués par le biais de cette démarche en &quot;Collectif des usagers de la BAN&quot;. L&apos;objectif est la connaissance des cas d&apos;application et la compréhension des besoins pour piloter les évolutions de la feuille de route BAN en adéquation avec les usages.
        </p>
        <div className="osmose-buttons">
          <Button iconId="fr-icon-mail-line" priority="secondary">
            Demander à rejoindre Osmose
          </Button>
          <Button iconId="fr-icon-question-answer-line">
            Accéder à Osmose
          </Button>
        </div>
      </section>
    </StyledWrapper>
  )
}
