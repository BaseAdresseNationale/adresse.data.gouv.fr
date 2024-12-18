import Link from 'next/link'
import { Quote } from '@codegouvfr/react-dsfr/Quote'

import Section from '@/components/Section'
import type { ColorTheme } from '@/theme'

import { QuoteWrapper, QuoteWrapperFooter } from './SectionQuotes.styles'

interface SectionQuotesProps {
  title: React.ReactNode
  data: {
    author: string
    text: string
    url: string
  }[]
  theme?: ColorTheme
}

function SectionQuotes({ title, data, theme }: SectionQuotesProps) {
  return (
    <Section theme={theme}>
      {title && typeof title === 'string' ? <h2>{title}</h2> : title}
      <QuoteWrapper>
        {data.map(({ author, text, url }) => (
          <Quote
            key={url}
            author={author}
            text={text}
            source={<Link href={url}>Consulter l&apos;article entier</Link>}
          />
        ))}
      </QuoteWrapper>
      <QuoteWrapperFooter>
        <a className="fr-link fr-link--icon-left fr-icon-chat-3-line" href="/blog">Découvrez tous les témoignages</a>
        <a className="fr-link fr-link--icon-left fr-icon-france-line" href="/deploiement-bal">Quelles communes ont mis à jour leur base ? </a>
      </QuoteWrapperFooter>
    </Section>
  )
}

export default SectionQuotes
