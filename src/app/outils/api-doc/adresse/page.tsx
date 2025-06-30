import Breadcrumb from '@/layouts/Breadcrumb'
import { getMarkdown } from '@/lib/markdown'
import type { DataType } from '@/lib/markdown'
import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'
import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'
import HtmlViewer from '@/components/HtmlViewer'

import { TextWrapper } from './page.styled'

export default async function ApiAdresse() {
  const { contentHtml: heroContentHtml, data: heroData }: { contentHtml?: string, data?: DataType } = await getMarkdown('/apis/service-geocodage--intro') || {}
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('/apis/service-geocodage') || {}

  return (
    <>
      <base target="_blank"></base>
      <Breadcrumb
        currentPageLabel="Service de géocodage de la Géoplateforme"
        segments={[
          {
            label: 'Outils & APIs',
            linkProps: {
              href: '/outils',
            },
          },
        ]}
      />
      <Suspense fallback={<p>Chargement...</p>}>
        {heroContentHtml
        && (
          <SectionHero
            pageTitle={heroData?.title || ''}
            picture={{
              src: '/img/pages/outils/compass2.svg',
              alt: 'Documentation API - Boussole',
              width: 150,
              height: 150,
            }}
          >
            <HtmlViewer html={heroContentHtml} />
          </SectionHero>
        )}
      </Suspense>

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
