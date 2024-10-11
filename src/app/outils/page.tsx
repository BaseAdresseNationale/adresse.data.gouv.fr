import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'

import Button from '@codegouvfr/react-dsfr/Button'
import Card from '@codegouvfr/react-dsfr/Card'
import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'

import Breadcrumb from '@/layouts/Breadcrumb'
import type { DataType } from '@/lib/markdown'
import { CardContainer } from '@/app/outils/page.styled'
import { TextWrapper } from '../blog/page.styled'

export default async function Outils() {
  const { contentHtml: heroContentHtml, data: heroData }: { contentHtml?: string, data?: DataType } = await getMarkdown('sommaire-outils') || {}

  return (
    <>
      <Breadcrumb
        currentPageLabel="Outils et API"
        segments={[]}
      />
      <Suspense fallback={<p>Chargement...</p>}>
        {heroContentHtml
        && (
          <SectionHero
            pageTitle={heroData?.title || ''}
            picture={{
              src: './img/pages/outils/in-progress.svg',
              alt: 'Illustration des "Outils et APIs"',
              width: 400,
              height: 310,
            }}
          >
            <HtmlViewer html={heroContentHtml} />
          </SectionHero>
        )}
      </Suspense>

      <Section
        title="Les outils de consultation"
        id="consultation"
      >
        <TextWrapper>
          <CardContainer $cols={2}>
            <Card
              title="L'explorateur BAN"
              titleAs="h5"
              desc="Chercher des adresses dans la Base Adresse Nationale."
              imageAlt="explorateur ban"
              imageUrl="./img/pages/outils/outils-ban.png"
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  linkProps={{
                    href: 'https://adresse.data.gouv.fr/base-adresse-nationale#4.4/46.9/1.7',
                    target: '_blank',
                  }}
                  size="small"
                >
                  Explorateur BAN
                </Button>
              )}
            />
            <Card
              title="Le Géocodeur CSV"
              titleAs="h5"
              desc="Ajouter un fichier CSV, définissez les colonnes à utiliser pour le géocodage."
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  linkProps={{
                    href: 'https://adresse.data.gouv.fr/csv',
                    target: '_blank',
                  }}
                  size="small"
                >
                  Géocodeur CSV
                </Button>
              )}
            />
            <Card
              title="API Adresse"
              titleAs="h5"
              desc="L’API adresse permet notamment d’effectuer rapidement une recherche d’adresse, mais aussi de pouvoir associer des coordonnées à une adresse 'géocoder' selon plusieurs critères."
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  iconId="fr-icon-code-s-slash-line"
                  linkProps={{
                    href: 'https://adresse.data.gouv.fr/api-doc/adresse',
                    target: '_blank',
                  }}
                  size="small"
                >
                  API adresse
                </Button>
              )}
            />
            <Card
              title="Téléchargement des données"
              titleAs="h5"
              desc="Télécharger des données de la BAN, base de données officiellement reconnues par l'administration."
              imageAlt="download data"
              imageUrl="./img/pages/outils/outils-ban.png"
              className="fr-card--md fr-card--horizontal-tier"
              footer={(
                <ul className="fr-btns-group fr-btns-group--equisized fr-btns-group--sm fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                  <li>
                    <Button
                      className="fr-btn--secondary"
                      linkProps={{
                        href: '/outils/telechargements',
                      }}
                      size="small"
                    >
                      Télécharger
                    </Button>
                  </li>
                  <li>
                    <Button
                      linkProps={{
                        href: '#',
                      }}
                      size="small"
                    >
                      Documentation
                    </Button>
                  </li>
                </ul>
              )}

            />
            <Card
              title="Certificat d'adresse"
              titleAs="h5"
              desc="Un organisme privé (ex. : un opérateur téléphonique) ou public (ex. : Notaire) vous demande un certificat d’adresse."
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <div style={{ maxWidth: 600 }}>
                  <input className="fr-input" aria-describedby="text-1-messages" name="text" id="text-1" type="text"></input>
                </div>
              )}
            />
            <Card
              title="L'explorateur FANTOIR"
              titleAs="h5"
              desc="Consultez la base FANTOIR de la DGFiP en quelques clics."
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                  <li>
                    <Button
                      className="fr-btn fr-btn--secondary"
                      linkProps={{
                        href: 'https://adresse.data.gouv.fr/fantoir',
                        target: '_blank',
                      }}
                      size="small"
                    >
                      Explorateur FANTOIR
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="fr-btn"
                      linkProps={{
                        href: 'https://doc.adresse.data.gouv.fr/utiliser-la-base-adresse-nationale/adresses-et-fantoir',
                        target: '_blank',
                      }}
                      size="small"
                    >
                      Documentation
                    </Button>
                  </li>
                </ul>
              )}

            />
            <Card
              title="API FANTOIR"
              titleAs="h5"
              desc="API permettant de consulter la base FANTOIR de la DGFiP."
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://github.com/BaseAdresseNationale/api-fantoir/blob/master/README.md#api',
                    target: '_blank',
                  }}
                  size="small"
                >
                  API FANTOIR
                </Button>
              )}
            />
            <Card
              title="Signalement"
              titleAs="h5"
              desc="Description texte SM regular Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et"
              imageAlt="signalement"
              imageUrl="./img/pages/outils/signalement.png"
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                  <li>
                    <Button
                      className="fr-btn fr-btn--secondary"
                      linkProps={{
                        href: '#',
                      }}
                      size="small"
                    >
                      Signalement
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="fr-btn"
                    >
                      Documentation
                    </Button>
                  </li>
                </ul>
              )}

            />
          </CardContainer>
        </TextWrapper>
      </Section>
      <Section
        title="Les outils de publication des adresses"
        id="publication"
      >
        <CardContainer $cols={2}>
          <Card
            title="Mes adresses"
            titleAs="h5"
            desc="Permet aux communes de modifier les adresses de son territoire."
            className="fr-card--horizontal-tier fr-card--md"
            imageAlt="mes-adresses"
            imageUrl="./img/pages/outils/outils-ban.png"
            footer={(
              <Button
                linkProps={{
                  href: '#',
                }}
                size="small"
              >
                Mes adresses
              </Button>
            )}
          />
          <Card
            title="Le validateur Base Adresse locale"
            titleAs="h5"
            desc="Vérifiez la conformité de votre fichier Base Adresse Locale"
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: '/outils/validateur-bal',
                }}
                size="small"
              >
                Validateur BAL
              </Button>
            )}
          />
          <Card
            title="Publication d’une Base Adresse Locale"
            titleAs="h5"
            desc="Description texte SM regular Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et"
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                <li>
                  <Button
                    className="fr-btn fr-btn--secondary"
                    linkProps={{
                      href: 'outils/formulaire-de-publication',
                    }}
                    size="small"
                  >
                    Publication
                  </Button>
                </li>
                <li>
                  <Button
                    className="fr-btn"
                  >
                    Documentation
                  </Button>
                </li>
              </ul>
            )}
          />
          <Card
            title="API dépot d’une Base Adresse Local"
            titleAs="h5"
            desc="API permettant de soumettre une Base Adresse Locale à la Base Adresse Nationale avec les gestions des habilitions."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                iconId="fr-icon-book-2-line"
                linkProps={{
                  href: 'outils/validateur-bal',
                }}
                size="small"
              >
                API dépot d’une Base Adresse Local
              </Button>
            )}
          />
        </CardContainer>
      </Section>
      <Section
        title="Les outils de la communauté"
        id="communauté"
      >
        <CardContainer $cols={2}>
          <Card
            title="Plugin QGIS"
            titleAs="h5"
            desc="Retrouvez la liste des plugin QGIS développés par et pour la communauté."
            className="fr-card--horizontal-tier fr-card--md"
            footer={<a className="fr-link fr-icon-arrow-right-line fr-link--icon-right" href="#">Liste des Plugin disponibles</a>}
          />
        </CardContainer>
      </Section>
      <Section
        title="Pour connaitre l’état des outils"
        id="etat-outils"
        theme="primary"
      >
        <CardContainer $cols={2}>
          <Card
            title="Supervision des outils et Apis"
            titleAs="h5"
            desc="Consultez la disponibilité des différents systèmes grâce à un outil de monitoring."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: 'https://status.adresse.data.gouv.fr/',
                  target: '_blank',
                }}
                size="small"
              >
                Supervision BAL / BAN
              </Button>
            )}
          />
          <Card
            title="L’état du déploiement"
            titleAs="h5"
            desc="Les différents service de la base adresse sont aussi disponible sous la forme d’APIs : Adresse, Base Adresse Locale, FANTOIR,… "
            className="fr-card fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: 'deploiement-bal',
                }}
                size="small"
              >
                État du déploiement
              </Button>
            )}
          />
        </CardContainer>
      </Section>
    </>
  )
}
