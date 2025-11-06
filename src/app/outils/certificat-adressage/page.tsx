import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'

import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'
import SearchBANWrapper from '@/components/SearchBAN/searchBanWrapper'
import { TextWrapper } from './page.styled'

import type { DataType } from '@/lib/markdown'

export default async function Home() {
  const { contentHtml: heroContentHtml, data: heroData }: { contentHtml?: string, data?: DataType } = await getMarkdown('/certificat-adressage/certificat--intro') || {}
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('/certificat-adressage/certificat') || {}

  return (
    <>
      <Suspense fallback={<p>Chargement...</p>}>
        {heroContentHtml && (
          <SectionHero
            pageTitle={heroData?.title || ''}
            picture={{
              src: '/img/pages/certificat-adressage/certificate_cqps.svg',
              alt: 'Illustration pour le certificat',
              width: 400,
              height: 310,
            }}
          >
            <HtmlViewer html={heroContentHtml} />
          </SectionHero>
        )}
      </Suspense>
      <Section className="fr-container fr-my-6w">
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div className="fr-col-12 fr-col-md-6">
            <p className="fr-text--lg">
              <strong>
                Vous avez besoin de ce document pour compléter un dossier ?
                Vous pouvez maintenant l&apos;obtenir en un clic à partir de notre explorateur.
              </strong>
            </p>
            <p>
              C&apos;est rapide, fiable, et certifié par la Mairie !
            </p>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <h3 style={{ marginBottom: '0.5rem' }}>
              Trouver une adresse pour générer un certificat
            </h3>
            <SearchBANWrapper />
          </div>
          <div className="fr-col-12">
            <p>
              Note : ce service repose sur des <b>prérequis techniques</b> dont toutes les adresses ne disposent pas, il n&apos;est pas accessible sur l&apos;ensemble des adresses.
              En cas d&apos;indisponibilité du service sur votre adresse, veuillez contacter votre mairie.
            </p>
          </div>
        </div>
      </Section>

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
    </>
  )
}
