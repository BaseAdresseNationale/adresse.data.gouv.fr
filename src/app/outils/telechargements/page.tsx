import { Suspense } from 'react'
import Link from 'next/link'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'
import { Card } from '@codegouvfr/react-dsfr/Card'
import { Button } from '@codegouvfr/react-dsfr/Button'

import Section from '@/components/Section'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'

import { TextWrapper, CardContainer } from './page.styled'

import type { DataType } from '@/lib/markdown'

export default async function PageDownloadBan() {
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('les_données_de_la_BAN') || {}

  return (
    <>
      <Section>
        <TextWrapper>
          <Suspense fallback={<p>Chargement...</p>}>
            <article>
              {contentHtml && <HtmlViewer html={contentHtml} />}
            </article>
            {
              data?.aside && (
                <aside>{data?.aside?.map(
                  ({ data }) =>
                    data?.contentHtml && (
                      <CallOut key={`${data?.data?.title}`}>
                        <HtmlViewer html={data?.contentHtml} />
                      </CallOut>
                    )
                )}
                </aside>
              )
            }
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
              href="/data"
            >
              Naviguez à travers toutes les données téléchargeables mises à disposition par la BAN
            </Link>
          </p>
        )}
      >
        <CardContainer>
          <div>
            <Card
              title="Format CSV historique"
              titleAs="h3"
              detail="Télécharger"
              endDetail="Fichier CSV compressé (.csv.gz)"
              desc={(
                <ul>
                  <li>Fichier d’usage général recommandé dans la majorité des cas</li>
                  <li>Couverture nationale</li>
                  <li>Une position par adresse</li>
                </ul>
              )}
              enlargeLink
              linkProps={{
                href: '/data/ban/adresses/latest/csv/adresses-france.csv.gz',
                target: '_blank',
                download: true,
              }}
              className="fr-card--download"
            />
          </div>
          <div>
            <Card
              title="Format BAL"
              titleAs="h3"
              detail="Télécharger"
              endDetail="Fichier CSV compressé (.csv.gz)"
              desc={(
                <ul>
                  <li>Fichier CSV au format BAL 1.3 (AITF)</li>
                  <li>Couverture nationale</li>
                  <li>Plusieurs positions par adresse</li>
                </ul>
              )}
              enlargeLink
              linkProps={{
                href: '/data/ban/adresses/latest/csv-bal/adresses-france.csv.gz',
                target: '_blank',
                download: true,
              }}
              className="fr-card--download"
            />
          </div>
          <div>
            <Card
              title="Format Addok"
              titleAs="h3"
              detail="Télécharger"
              endDetail="Fichier ndJSON compressé (.ndjson.gz)"
              desc={(
                <ul>
                  <li>Fichier spécifique pour le géocodeur Addok</li>
                  <li>Couverture nationale</li>
                  <li>Une position par adresse</li>
                </ul>
              )}
              enlargeLink
              linkProps={{
                href: '/data/ban/adresses/latest/addok/adresses-addok-france.ndjson.gz',
                target: '_blank',
                download: true,
              }}
              className="fr-card--download"
            />
          </div>
        </CardContainer>
      </Section>

      <Section
        title="Services cartographiques"
        id="carto"
      >
        <p>
          <Link className="fr-link" href="#" target="_blank">Retrouvez les tutoriels d’utilisation des flux avec un outil SIG</Link>
        </p>
        <CardContainer $cols={4}>
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
                    href: '#',
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
                    href: '#',
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
                    href: '#',
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
              title="Adresses extraites du cadastre"
              titleAs="h3"
              desc={(
                <>
                  Ce jeu de données contient toutes les adresses extraites des fichiers du cadastre (plan et fichier des parcelles bâties).
                </>
              )}
              footer={(
                <Button
                  iconId="fr-icon-window-line"
                  linkProps={{
                    href: '#',
                  }}
                  size="small"
                >
                  Voir sur data.gouv.fr
                </Button>
              )}
            />
          </div>
        </CardContainer>
      </Section>
    </>
  )
}