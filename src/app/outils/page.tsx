import { Suspense } from 'react'

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
import Badge from '@codegouvfr/react-dsfr/Badge'

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
              src: '/img/pages/outils/in-progress.svg',
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
        title="Les outils d'exploitation"
        id="consultation"
      >
        <TextWrapper>
          <CardContainer $cols={2}>
            <Card
              title="L'explorateur BAN"
              titleAs="h5"
              desc="Chercher des adresses dans la Base Adresse Nationale."
              imageAlt="explorateur ban"
              imageUrl="/img/pages/outils/outils-ban.png"
              nativeImgProps={{ style: { objectFit: 'contain' } }}
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  linkProps={{
                    href: 'carte-base-adresse-nationale',
                  }}
                  size="small"
                >
                  Explorateur BAN
                </Button>
              )}
            />
            <Card
              title="Téléchargement des données"
              titleAs="h5"
              desc="Télécharger les données de la Base Adresse Nationale (BAN)"
              imageAlt="Téléchargement des données"
              imageUrl="/img/pages/outils/telechargement.png"
              nativeImgProps={{ style: { objectFit: 'contain' } }}
              className="fr-card--md fr-card--horizontal-tier"
              footer={(
                <ul className="fr-btns-group fr-btns-group--equisized fr-btns-group--sm fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                  <li>
                    <Button
                      className="fr-btn"
                      linkProps={{
                        href: 'data/ban/adresses/latest',
                      }}
                      size="small"
                    >
                      Télécharger
                    </Button>
                  </li>
                  <li>
                    <Button
                      className="fr-btn--secondary"
                      linkProps={{
                        href: '/outils/telechargements',
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
              title="Service de géocodage"
              titleAs="h5"
              desc="Effectuer rapidement une recherche d’adresse, et récupérer ses coordonnées. Géocodage direct et inverse, unitaire et en masse."
              imageAlt="Illustration service de géocodage"
              imageUrl="/img/pages/outils/service-geocodage.png"
              nativeImgProps={{ style: { objectFit: 'contain' } }}
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  linkProps={{
                    href: '/outils/api-doc/adresse',
                  }}
                  size="small"
                >
                  Service de géocodage Géoplateforme
                </Button>
              )}
            />
            <Card
              title={<>Service d&apos;autocomplétion <Badge noIcon severity="new">Nouveau</Badge></>}
              titleAs="h5"
              desc="Faciliter la saisie en suggérant des localisants probables au fur et à mesure de la saisie d’adresses ou de noms de lieux."
              imageAlt="Illustration le service d'autocomplétion du géocodeur"
              imageUrl="/img/pages/outils/autocompletion.png"
              nativeImgProps={{ style: { objectFit: 'contain' } }}
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  iconId="fr-icon-code-s-slash-line"
                  linkProps={{
                    href: 'https://geoservices.ign.fr/documentation/services/services-geoplateforme/autocompletion',
                    target: '_blank',
                  }}
                  size="small"
                >
                  Documentation
                </Button>
              )}
            />
            <Card
              title="Géocodeur CSV"
              titleAs="h5"
              desc="Géocoder facilement une liste d'adresses à partir d'un fichier CSV."
              imageAlt="Illustration pour le géocodeur csv"
              imageUrl="/img/pages/outils/geocodeur-csv.png"
              nativeImgProps={{ style: { objectFit: 'contain' } }}
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  linkProps={{
                    href: '/outils/csv',
                  }}
                  size="small"
                >
                  Géocodeur CSV
                </Button>
              )}
            />
            <Card
              title={<>Certificat d&apos;adressage <Badge noIcon severity="new">Nouveau</Badge></>}
              titleAs="h5"
              desc="Générer un certificat d'adressage officiel en un clic"
              imageAlt="Illustation certificat d'adressage"
              imageUrl="/img/pages/certificat-adressage/certificate_outils.png"
              nativeImgProps={{ style: { objectFit: 'contain' } }}
              className="fr-card--horizontal-tier fr-card--md"
              footer={(
                <Button
                  linkProps={{
                    href: '/outils/certificat-adressage',
                  }}
                  size="small"
                >
                  Découvrir le certificat d&apos;adressage
                </Button>
              )}
            />
            {/* <Card
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

            /> */}
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
            desc="Permettre aux communes de modifier les adresses de son territoire."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: 'https://mes-adresses.data.gouv.fr/',
                  target: '_blank',
                }}
                size="small"
              >
                Mes adresses
              </Button>
            )}
          />
          <Card
            title="Formulaire de publication"
            titleAs="h5"
            desc="Publier une base adresse locale à partir d'un formulaire."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                <li>
                  <Button
                    className="fr-btn fr-btn"
                    linkProps={{
                      href: 'outils/formulaire-de-publication',
                    }}
                    size="small"
                  >
                    Formulaire Publication
                  </Button>
                </li>
              </ul>
            )}
          />
          <Card
            title="API dépôt BAL"
            titleAs="h5"
            desc="Soumettre une Base Adresse Locale à la Base Adresse Nationale via API."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <ul className="fr-btns-group fr-btns-group--equisized fr-btns-group--sm fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                <li>
                  <Button
                    linkProps={{
                      href: 'https://plateforme-bal.adresse.data.gouv.fr/api-depot/api',
                      target: '_blank',
                    }}
                    size="small"
                  >
                    Swagger
                  </Button>
                </li>
                <li>
                  <Button
                    className="fr-btn fr-btn--secondary"
                    linkProps={{
                      href: 'https://github.com/BaseAdresseNationale/api-depot/wiki/04_Publication_BAL',
                      target: '_blank',
                    }}
                    size="small"
                  >
                    Documentation publication BAL
                  </Button>
                </li>
              </ul>
            )}
          />
          <Card
            title="Moissonneur BAL"
            titleAs="h5"
            desc="Soumettre une Base Adresse Locale à la Base Adresse Nationale via data.gouv.fr."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: 'https://doc.adresse.data.gouv.fr/docs/mes-adresses/publier-une-base-adresse-locale/generalites-sur-la-publication',
                  target: '_blank',
                }}
                size="small"
              >
                Documentation publication BAL
              </Button>
            )}
          />
          <Card
            title={<>API Validateur BAL <Badge noIcon severity="new">Nouveau</Badge></>}
            titleAs="h5"
            desc="Vérifier la conformité de votre fichier Base Adresse Locale via une API."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: 'https://plateforme-bal.adresse.data.gouv.fr/validateur-api/api',
                  target: '_blank',
                }}
                size="small"
              >
                Swagger
              </Button>
            )}
          />
          <Card
            title="Application Validateur BAL"
            titleAs="h5"
            desc="Vérifier la conformité de votre fichier Base Adresse Locale"
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
            title={(<>Mise en forme BAL <Badge noIcon severity="info">BETA</Badge></>)}
            titleAs="h5"
            desc="Améliorer votre BAL grâce à une mise en forme automatique"
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: '/outils/validateur-bal',
                }}
                size="small"
              >
                Mise en forme BAL
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
            title={<>API FANTOIR  <Badge noIcon severity="new">Dépréciée</Badge></>}
            titleAs="h5"
            desc="Consulter la base FANTOIR de la Direction générale des finances publiques (DGFIP)."
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
            title="L'explorateur FANTOIR"
            titleAs="h5"
            desc="Consulter la base FANTOIR de la Direction générale des finances publiques (DGFIP) en quelques clics."
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                <li>
                  <Button
                    className="fr-btn fr-btn"
                    linkProps={{
                      href: '/outils/fantoir',
                    }}
                    size="small"
                  >
                    Explorateur FANTOIR
                  </Button>
                </li>
                <li>
                  <Button
                    className="fr-btn fr-btn--secondary"
                    linkProps={{
                      href: 'https://doc.adresse.data.gouv.fr/docs/documentation-generale/utiliser-la-base-adresse-nationale/adresses-et-fantoir',
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
            title="Convertisseur TOPO - FANTOIR"
            titleAs="h5"
            desc="Outil de conversion TOPO vers FANTOIR développé par le Centre régional Auvergne-Rhône-Alpes de l'information géographique(CRAIG)"
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                <li>
                  <Button
                    className="fr-btn fr-btn"
                    linkProps={{
                      href: 'https://github.com/landryb/topo2fantoir',
                      target: '_blank',
                    }}
                    size="small"
                  >
                    topo2fantoir
                  </Button>
                </li>
                <li>
                  <Button
                    className="fr-btn fr-btn--secondary"
                    linkProps={{
                      href: 'https://www.craig.fr/',
                      target: '_blank',
                    }}
                    size="small"
                  >
                    En savoir plus sur CRAIG
                  </Button>
                </li>
              </ul>
            )}
          />
          <Card
            title="PlugIN QGIS Géocodage"
            titleAs="h5"
            desc="Accéder directement depuis QGIS aux services de la Géoplateforme, dont le service de géocodage unitaire et en fichiers"
            imageAlt="Illustration service de géocodage"
            imageUrl="/img/pages/outils/qgis.png"
            nativeImgProps={{ style: { objectFit: 'contain' } }}
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <ul className="fr-btns-group fr-btns-group--sm fr-btns-group--equisized fr-btns-group--inline-reverse fr-btns-group--inline-lg">
                <li>
                  <Button
                    className="fr-btn fr-btn"
                    linkProps={{
                      href: 'https://github.com/Geoplateforme/plugin-qgis-geoplateforme',
                      target: '_blank',
                    }}
                    size="small"
                  >
                    PlugIN QGIS GPF
                  </Button>
                </li>
                <li>
                  <Button
                    className="fr-btn fr-btn--secondary"
                    linkProps={{
                      href: '/blog/plugin-qgis-pour-integrer-le-geocodeur-de-la-ban',
                    }}
                    size="small"
                  >
                    En savoir plus
                  </Button>
                </li>
              </ul>
            )}
          />
        </CardContainer>
      </Section>
      <Section
        title="Les outils de supervision"
        id="etat-outils"
      >
        <CardContainer $cols={2}>
          <Card
            title="Supervision des outils et Apis"
            titleAs="h5"
            desc="Consulter la disponibilité des différents composants de l'écosystème adresse grâce à un outil de monitoring."
            imageAlt="Image pour les outils de supervision"
            imageUrl="/img/pages/outils/serveur-status.png"
            nativeImgProps={{ style: { objectFit: 'contain' } }}
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
            title="Les métriques d'impact"
            titleAs="h5"
            desc="Consulter les statistiques sur la BAN"
            imageAlt="Image pour les métriques"
            imageUrl="/img/pages/outils/stats.png"
            nativeImgProps={{ style: { objectFit: 'contain' } }}
            className="fr-card fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: '/stats',
                }}
                size="small"
              >
                Statistiques
              </Button>
            )}
          />
          <Card
            title={(<>Notifications BAN <Badge noIcon severity="info">BETA</Badge></>)}
            titleAs="h5"
            desc="Recevoir les alertes et notifications du système de traitement des données BAN en temps réel."
            imageAlt="Image pour les notifications BAN"
            imageUrl="/img/pages/outils/notification-ban.png"
            nativeImgProps={{ style: { objectFit: 'contain' } }}
            className="fr-card--horizontal-tier fr-card--md"
            footer={(
              <Button
                linkProps={{
                  href: '/outils/notifications-ban',
                }}
                size="small"
              >
                Notifications BAN
              </Button>
            )}
          />
        </CardContainer>

      </Section>
    </>
  )
}
