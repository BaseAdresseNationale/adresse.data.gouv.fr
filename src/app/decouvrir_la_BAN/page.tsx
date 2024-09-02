import { Suspense } from 'react'
import { CallOut } from '@codegouvfr/react-dsfr/CallOut'

import Section from '@/components/Section'
import SectionHero from '@/components/SectionHero'
import HtmlViewer from '@/components/HtmlViewer'
import { getMarkdown } from '@/lib/markdown'

import { TextWrapper } from './page.styled'

import type { DataType } from '@/lib/markdown'

export default async function Home() {
  const { contentHtml, data }: { contentHtml?: string, data?: DataType } = await getMarkdown('decouvrir_la_BAN') || {}

  return (
    <>
      <SectionHero
        pageTitle="Découvrir la Base Adresse Nationale"
        picture={{
          src: './img/home_page_hero_ban.svg',
          alt: 'Illustration de "La Base Adresse Nationale"',
          width: 400,
          height: 310,
        }}
      >
        <p>
          La Base Adresse Nationale est l’une des neuf bases de données du service
          public des données de référence. Elle est la seule base de données
          d’adresses officiellement reconnue par l’administration.
        </p>
        <p>
          Service numérique d’usage partagé et infrastructure socle sur laquelle
          sont adossées de nombreuses politiques publiques, elle fait partie
          du système d’information et de communication de l’État et est à ce
          titre placée sous la responsabilité du Premier ministre.
        </p>

      </SectionHero>

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
