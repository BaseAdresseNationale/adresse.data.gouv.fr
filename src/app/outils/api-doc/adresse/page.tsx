import Breadcrumb from '@/layouts/Breadcrumb'
import { getMarkdown } from '@/lib/markdown'
import type { DataType } from '@/lib/markdown'
import { Suspense } from 'react'
import SectionHero from '@/components/SectionHero'
import HtmlViewer from '@/components/HtmlViewer'
import CurlDoc from './components/curl-doc'

async function ApiAdresse() {
  const { contentHtml: heroContentHtml, data: heroData }: { contentHtml?: string, data?: DataType } = await getMarkdown('/apis/api-adresse') || {}
  return (
    <>
      <base target="_blank"></base>
      <Breadcrumb
        currentPageLabel="API adresse"
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
      <CurlDoc />
    </>
  )
}
export default ApiAdresse
