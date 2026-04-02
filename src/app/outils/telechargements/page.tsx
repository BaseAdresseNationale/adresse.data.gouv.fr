import { Suspense } from 'react'
import Link from 'next/link'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'
import CardListDesc from '@/components/CardListDesc'
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
            <CardListDesc
              title="Format CSV historique"
              items={[
                <>Fichier d'usage général recommandé dans la majorité des cas.{' '}<a href="telechargements/format-csv">En savoir plus</a></>,
                <>Une position par adresse</>,
                <><a href="https://github.com/BaseAdresseNationale/adresse.data.gouv.fr/blob/master/public/schemas/adresses-csv.md" target="_blank" rel="noopener noreferrer">Schéma de données</a></>,
              ]}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{ href: '/data/ban/adresses/latest/csv' }}
                  size="small"
                >
                  Télécharger au format CSV
                </Button>
              )}
            />
          </div>

          <div>
            <CardListDesc
              title="Format CSV avec identifiants BAN"
              items={[
                <>Fichier CSV avec les colonnes identifiants BAN</>,
                <>Une position par adresse</>,
              ]}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{ href: '/data/ban/adresses/latest/csv-with-ids' }}
                  size="small"
                >
                  Télécharger au format CSV
                </Button>
              )}
            />
          </div>

          <div>
            <CardListDesc
              title="Format Addok"
              items={[
                <>Fichier spécifique pour le géocodeur Addok</>,
                <>Une position par adresse</>,
              ]}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{ href: '/data/ban/adresses/latest/addok' }}
                  size="small"
                >
                  Télécharger au format Addok
                </Button>
              )}
            />
          </div>
        </CardContainer>
      </Section>

      <Section title="Services cartographiques" id="carto">
        <p>
          <Link
            className="fr-link"
            href="https://geoservices.ign.fr/documentation/services/utilisation-sig"
            target="_blank"
            rel="noopener noreferrer"
          >
            Retrouver les tutoriels d’utilisation des flux avec un outil SIG
          </Link>
        </p>

        <CardContainer $cols={3}>
          <div>
            <CardListDesc
              title="Format MVT (tuiles vectorielles)"
              descPrefix="Visualisation cartographique des adresses BAN en tuiles vectorielles"
              items={[
                <>Mise à jour en temps réel</>,
                <>1 position par adresse</>,
              ]}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://github.com/BaseAdresseNationale/ban-plateforme/wiki/Tuiles-vectorielles',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }}
                  size="small"
                >
                  Lire la documentation
                </Button>
              )}
            />
          </div>

          <div>
            <CardListDesc
              title="Format WFS"
              descPrefix="Visualisation cartographique des adresses BAN en WFS"
              items={[
                <>Mise à jour mensuelle</>,
                <>Nom de la couche : BAN.DATA.GOUV:ban</>,
                <>1 position par adresse</>,
              ]}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://geoservices.ign.fr/services-web-experts-adresse',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  }}
                  size="small"
                >
                  Lire la documentation
                </Button>
              )}
            />
          </div>

          <div>
            <CardListDesc
              title="Format WMS"
              descPrefix="Visualisation cartographique des adresses BAN en WMS"
              items={[
                <>Mise à jour mensuelle</>,
                <>Nom de la couche : BAN.DATA.GOUV</>,
                <>1 position par adresse</>,
              ]}
              footer={(
                <Button
                  iconId="fr-icon-book-2-line"
                  linkProps={{
                    href: 'https://geoservices.ign.fr/services-web-experts-adresse',
                    target: '_blank',
                    rel: 'noopener noreferrer',
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
