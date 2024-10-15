import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'

import Section from '@/components/Section'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'
import type { DataType } from '@/lib/markdown'
import Breadcrumb from '@/layouts/Breadcrumb'

import { TextWrapper } from './page.styled'

export default async function formatCSV() {
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('format-csv') || {}

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
