import { Suspense } from 'react'
import Link from 'next/link'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'
import { Card } from '@codegouvfr/react-dsfr/Card'
import { Button } from '@codegouvfr/react-dsfr/Button'

import Section from '@/components/Section'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'

import { TextWrapper, CardContainer } from './page.styled'

import type { DataType } from '@/lib/markdown'

export default async function PageDownloadBan() {
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('les_donnees_de_la_BAN') || {}

  return (
    <>
      <Section>
        <TextWrapper>
          <Suspense fallback={<p>Chargement...</p>}>
            <article>
              {contentHtml && <HtmlViewer html={contentHtml} />}
            </article>
          </Suspense>
        </TextWrapper>
      </Section>

      <Section
        title="Télécharger"
        id="download"
        theme="primary"
        footer={(
          <p>
            <Link
              className="fr-link fr-link--icon-left ri-folders-line"
              href="/data/ban/adresses"
            >
              Naviguer à travers toutes les données téléchargeables mises à disposition par la BAN
            </Link>
          </p>
        )}
      >
        <CardContainer $cols={4}>
          <div>
            <Card
              title="Format CSV historique"
              titleAs="h3"
              desc={(
                <>
                  <ul>
                    <li>Fichier d’usage général recommandé dans la majorité des cas. <a href="telechargements/format-csv">En savoir plus</a></li>
                    <li>Une position par adresse</li>
                    <li><a href="https://github.com/BaseAdresseNationale/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md" target="_blank">Schéma de données</a></li>
                  </ul>
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: '/data/ban/adresses/latest/csv',
                  }}
                  size="small"
                >
                  Télécharger au format CSV
                </Button>
              )}
            />
          </div>
          <div>
            <Card
              title="Format BAL"
              titleAs="h3"
              desc={(
                <>
                  <ul>
                    <li>Fichier CSV au format BAL 1.3 (AITF)</li>
                    <li>Plusieurs positions par adresse</li>
                  </ul>
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: '/data/ban/adresses/latest/csv-bal/',
                  }}
                  size="small"
                >
                  Télécharger au format BAL
                </Button>
              )}
            />
          </div>
          <div>
            <Card
              title="Format Addok"
              titleAs="h3"
              desc={(
                <>
                  <ul>
                    <li>Fichier spécifique pour le géocodeur Addok</li>
                    <li>Une position par adresse</li>
                  </ul>
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: '/data/ban/adresses/latest/addok',
                  }}
                  size="small"
                >
                  Télécharger au format Addok
                </Button>
              )}
            />
          </div>
        </CardContainer>
      </Section>
      <Section
        title="Services cartographiques"
        id="carto"
      >
        <p>
          <Link className="fr-link" href="https://geoservices.ign.fr/documentation/services/utilisation-sig" target="_blank">Retrouver les tutoriels d’utilisation des flux avec un outil SIG</Link>
        </p>
        <CardContainer $cols={3}>
          <div>
            <Card
              title="Format MVT (tuiles vectorielles)"
              titleAs="h3"
              desc={(
                <>
                  Visualisation cartographique des adresses BAN en tuiles vectorielles
                  <ul>
                    <li>Mise à jour en temps réel</li>
                    <li>1 position par adresse</li>
                  </ul>
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://github.com/BaseAdresseNationale/ban-plateforme/wiki/Tuiles-vectorielles',
                    target: '_blank',
                  }}
                  size="small"
                >
                  Lire la documentation
                </Button>
              )}
            />
          </div>
          <div>
            <Card
              title="Format WFS"
              titleAs="h3"
              desc={(
                <>
                  Visualisation cartographique des adresses BAN en WFS
                  <ul>
                    <li>Mise à jour mensuelle</li>
                    <li>Nom de la couche : BAN.DATA.GOUV:ban</li>
                    <li>1 position par adresse</li>
                  </ul>
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://geoservices.ign.fr/services-web-experts-adresse',
                    target: '_blank',
                  }}
                  size="small"
                >
                  Lire la documentation
                </Button>
              )}
            />
          </div>
          <div>
            <Card
              title="Format WMS"
              titleAs="h3"
              desc={(
                <>
                  Visualisation cartographique des adresses BAN en WMS
                  <ul>
                    <li>Mise à jour mensuelle</li>
                    <li>Nom de la couche : BAN.DATA.GOUV</li>
                    <li>1 position par adresse</li>
                  </ul>
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://geoservices.ign.fr/services-web-experts-adresse',
                    target: '_blank',
                  }}
                  size="small"
                >
                  Lire la documentation
                </Button>
              )}
            />
          </div>
        </CardContainer>
      </Section>
    </>
  )
}
