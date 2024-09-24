import Link from 'next/link'

import Section from '@/components/Section'
import ResponsiveImage from '@/components/ResponsiveImage'

import { ContentWrapper } from './error-layout.styled'

interface ErrorLayoutProps {
  title: string
  subTitle: string
  imgSrc: string
  imgAlt: string
  children: React.ReactNode
}

export default function ErrorLayout({ title, subTitle, imgSrc, imgAlt, children }: ErrorLayoutProps) {
  return (
    <Section
      pageTitle={title}
      title={subTitle}
      footer={(
        <Link className="fr-btn" href="/">
          Page d’accueil
        </Link>
      )}
    >
      <ContentWrapper>
        <div>
          {children}
        </div>

        <div>
          <ResponsiveImage src={imgSrc} alt={imgAlt} />
        </div>
      </ContentWrapper>
    </Section>

  )
}
