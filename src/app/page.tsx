import { Card } from '@codegouvfr/react-dsfr/Card'
import { Button } from '@codegouvfr/react-dsfr/Button'

import Section from '@/components/Section'
import Notices from '@/components/Notices'
import SectionHero from '@/components/SectionHero'
import SectionTilesList from '@/components/SectionTilesList'
import SectionQuotes from '@/components/SectionQuotes'
import { getStats } from '@/lib/api-ban'

import dataNotices from '@/data/sample-notices.json'
import dataBAN from '@/data/sample-ban-info.json'
import dataBAL from '@/data/sample-bal-info.json'
import dataActions from '@/data/sample-actions.json'
import dataQuotes from '@/data/sample-quotes.json'
import theme from '@/theme'

import { CardContainer } from './page.styles'

export default async function Home() {
  const stats = await getStats()

  return (
    <>
      <Notices {...dataNotices} />

      <SectionHero
        pageTitle="La base adresse nationale"
        picture={{
          src: './img/home_page_hero_ban.svg',
          alt: 'Illustration de "La base adresse nationale"',
          width: 400,
          height: 310,
        }}
        footerLinks={[
          {
            label: 'Découvrir la Base Adresse Nationale',
            href: '/decouvrir_la_BAN',
          },
        ]}
      >
        <p>
          Pour que les services d’urgence arrivent au bon endroit, pour vous
          permettre de réaliser une analyse cartographique ou encore pour mieux
          coordonnées les chantiers, les adresses sont un véritable enjeu de
          souveraineté pour la France.
        </p>
        <p>
          <strong>
            Notre Objectif : référencer l’intégralité des adresses du territoire et
            les rendre utilisables par tous.
          </strong>
        </p>
      </SectionHero>

      <SectionTilesList
        data={dataBAN}
        title="Utilisez la base adresse nationale"
        theme="secondary"
      />

      <SectionTilesList
        data={dataBAL}
        title="Constituez la base adresse locale de votre commune !"
      />

      {stats && dataQuotes?.length && (
        <SectionQuotes
          title={(
            <h2>
              Déjà <strong style={{ color: theme.colors['primary'].main }}>{new Intl.NumberFormat('fr-FR').format(stats.bal.nbCommunesCouvertes)} communes</strong>{' '}
              ont mis à jour leurs bases d’adresses
            </h2>
          )}
          data={dataQuotes}
          theme="secondary"
        />
      )}

      <SectionTilesList
        data={dataActions}
        title="Constituez la base adresse locale de votre commune !"
        isSmallTiles
        withoutLinkIcon
      />

      <Section title="Devenir partenaire" theme="primary">
        <CardContainer>
          <div>
            <Card
              title="Adopter la charte"
              titleAs="h3"
              desc={(
                <>La Charte de la Base Adresse Locale rassemble les organismes qui privilégient
                  le format Base Adresse Locale et s’engagent en matière de gouvernance. L’enjeu pour la
                  commune, autorité responsable de l’adresse, est d’identifier un référent en capacité de
                  l’assister au besoin.
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-newspaper-line"
                  linkProps={{
                    href: '#',
                  }}
                  priority="secondary"
                  size="small"
                >
                  Découvrir la charte
                </Button>
              )}
            />
          </div>
          <div>
            <Card
              title="Les différents modes de publication"
              titleAs="h3"
              desc={(
                <>Cinq méthodes permettent de publier une Base Adresse Locale dans la Base Adresse
                  Nationale. L’éditeur Mes Adresses permet à la fois de mettre à jour et de publier
                  ses adresses.
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: '#',
                  }}
                  priority="secondary"
                  size="small"
                >
                  Accéder à la documentation
                </Button>
              )}
            />
          </div>
        </CardContainer>
      </Section>
    </>
  )
}
