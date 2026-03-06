import ProConnectRedirectClient from '@/components/ProConnectRedirectClient'
import { Card } from '@codegouvfr/react-dsfr/Card'
import { Button } from '@codegouvfr/react-dsfr/Button'
import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'
import SectionTilesList from '@/components/SectionTilesList'
import SectionSearchBAN from '@/components/SectionSearchBAN'
import BlogGrid from '@/components/BlogGrid'
import SectionQuotes from '@/components/SectionQuotes'
import { getStats } from '@/lib/api-ban'
import { getPosts } from '@/lib/blog'
import theme from '@/theme'

import dataBAN from '@/data/sample-ban-info.json'
import dataBAL from '@/data/sample-bal-info.json'
import dataActions from '@/data/sample-actions.json'
import dataQuotes from '@/data/sample-quotes.json'

import { CardContainer } from './page.styles'

export const revalidate = 3600 // 1 hour

import { env } from 'next-runtime-env'

export default async function Home() {
  const stats = await getStats()
  const highlightedDatas = await getPosts({ limit: 3 })
  const highlightedPosts = highlightedDatas?.posts || []

  return (
    <>
      <ProConnectRedirectClient />
      <SectionHero
        pageTitle="La Base Adresse Nationale"
        picture={{
          src: '/img/home_page_hero_ban.svg',
          alt: 'Illustration de "La Base Adresse Nationale"',
          width: 400,
          height: 310,
        }}
        footerLinks={[
          {
            label: 'Découvrir la Base Adresse Nationale',
            href: '/decouvrir-la-BAN',
          },
        ]}
      >
        <p>
          Pour que les services d’urgence arrivent au bon endroit. <br />
          Pour un raccordement efficace aux réseaux d’énergies ou de communication. <br />
          Ou encore pour des analyses cartographiques précises. <br />
          Les adresses : enjeu de souveraineté nationale.
        </p>
        <p>
          <strong>
            Notre Objectif : référencer l’intégralité des adresses du territoire et
            les rendre utilisables par tous.
          </strong>
        </p>
      </SectionHero>

      <SectionSearchBAN />

      <SectionTilesList
        data={dataBAN}
        title="Utiliser la Base Adresse Nationale"
        id="utilisez-la-base-adresse-nationale"
        theme="secondary"
      />

      <SectionTilesList
        data={dataBAL}
        title="Constituer la Base Adresse Locale de votre commune"
        id="constituez-la-base-adresse-locale-de-votre-commune"
      />

      {stats && dataQuotes?.length && (
        <SectionQuotes
          title={(
            <h2>
              Déjà <strong style={{ color: theme.colors['primary'].main }}>{new Intl.NumberFormat('fr-FR').format(stats.bal.nbCommunesCouvertes)} communes</strong>{' '}
              ont mis à jour leur base d’adresses
            </h2>
          )}
          data={dataQuotes}
          theme="secondary"
        />
      )}

      <SectionTilesList
        data={dataActions}
        title="Nous retrouver, se former"
        id="nous-retrouver-se-former"
        isSmallTiles
        withoutLinkIcon
      />

      <Section
        title="Devenir partenaire"
        id="devenir-partenaire"
        theme="primary"
      >
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
                    href: '/communaute/charte-base-adresse-locale',
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
                    href: 'https://doc.adresse.data.gouv.fr/docs/mes-adresses/publier-une-base-adresse-locale/generalites-sur-la-publication',
                    target: '_blank',
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

      <BlogGrid
        title="Le blog : articles et témoignages"
        posts={highlightedPosts}
        footer={(
          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            linkProps={{
              href: '/blog',
            }}
            priority="primary"
          >
            Parcourir tout le blog
          </Button>
        )}
      />
    </>
  )
}
