import Button from '@codegouvfr/react-dsfr/Button'

import Section from '@/components/Section'

import { HeroWrapper, HeroFooter, HeroImage } from './SectionHero.styles'

interface HeroProps {
  pageTitle: string
  children: React.ReactNode
  footerLinks?: {
    label: string
    href: string
    target?: string
  }[]
  picture: {
    src: string
    alt: string
    width?: number
    height?: number
  }
}

function Hero({
  pageTitle,
  children,
  footerLinks,
  picture,
}: HeroProps) {
  return (
    <Section theme="primary">
      <HeroWrapper>
        <div>
          <h1>{pageTitle}</h1>
          {children}
          {
            footerLinks?.length
            && (
              <HeroFooter>
                {footerLinks.map(({ label, ...linkProps }) => (
                  <Button
                    iconId="fr-icon-arrow-right-line"
                    iconPosition="right"
                    key={label}
                    linkProps={linkProps}
                  >
                    {label}
                  </Button>
                ))}
              </HeroFooter>
            )
          }
        </div>
        <div>
          <HeroImage
            src={picture.src}
            alt={picture.alt}
            width={picture.width || 250}
            height={picture.height}
          />
        </div>
      </HeroWrapper>
    </Section>
  )
}

export default Hero
