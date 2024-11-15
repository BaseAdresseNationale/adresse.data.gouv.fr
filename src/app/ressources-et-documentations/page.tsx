import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'

import Section from '@/components/Section'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'
import type { DataType } from '@/lib/markdown'
import { TextWrapper } from './page.styled'

export default async function DocumentationPage() {
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('ressources-et-documentations/documentation') || {}

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
    </>
  )
}
