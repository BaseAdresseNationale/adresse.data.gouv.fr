import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'

import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'

import { TextWrapper } from './page.styled'

import type { DataType } from '@/lib/markdown'

export default async function Home() {
  const { contentHtml: heroContentHtml, data: heroData }: { contentHtml?: string, data?: DataType } = await getMarkdown('la-ban/utiliser-la-ban-intro') || {}
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('la-ban/utiliser-la-ban') || {}

  return (
    <>
      <Suspense fallback={<p>Chargement...</p>}>
        {heroContentHtml
        && (
          <SectionHero
            pageTitle={heroData?.title || ''}
            picture={{
              src: './img/pages/decouvrir_la_BAN/illustration-ban.svg',
              alt: 'Illustration exemple adresse de "La Base Adresse Nationale"',
              width: 400,
              height: 194,
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
