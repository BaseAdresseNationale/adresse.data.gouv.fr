import { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { env } from 'next-runtime-env'
import { Footer as FooterDSFR } from '@codegouvfr/react-dsfr/Footer'
import { Follow, type FollowProps } from '@codegouvfr/react-dsfr/Follow'
import { headerFooterDisplayItem } from '@codegouvfr/react-dsfr/Display'

import { newsletterOptIn } from '@/lib/api-brevo'
import { useMainLayout } from '@/layouts/MainLayout'

import {
  FooterWrapper,
  FooterDisplayButton,
  FooterBody,
} from './Footer.styles'

const SOCIAL_NETWORKS_URL_BLUESKY = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_BLUESKY')
const SOCIAL_NETWORKS_URL_MASTODON = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_MASTODON')
const SOCIAL_NETWORKS_URL_FACEBOOK = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_FACEBOOK')
const SOCIAL_NETWORKS_URL_LINKEDIN = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_LINKEDIN')
const SOCIAL_NETWORKS_URL_GITHUB = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_GITHUB')
const SOCIAL_NETWORKS_URL_RSS = env('NEXT_PUBLIC_SOCIAL_NETWORKS_URL_RSS')

const NewsletterOptinWithNoSSR = dynamic(
  () => import('../components/NewsletterOptin'),
  { ssr: false }
)

export default function Footer() {
  const { typeLayout } = useMainLayout()
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [isEventReady, setIsEventReady] = useState(false)

  const size = useMemo(() => (typeLayout === 'full-screen' ? 'hidden' : 'default'), [typeLayout])
  const previousSize = useRef<typeof size | null>(null)

  useEffect(() => {
    if (previousSize.current !== size) {
      previousSize.current = size
      setIsEventReady(false)
    }
    else if (!isEventReady) {
      setIsEventReady(true)
    }
  }, [size, isEventReady])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowCaptcha(true)
  }

  const handleOptIn = useCallback(async () => {
    try {
      await newsletterOptIn(email)
      setSuccess(true)
    }
    catch (error) {
      console.error(error)
    }
  }, [email])

  return (
    <FooterWrapper
      $isHidden={size === 'hidden'}
      $isEventReady={isEventReady}
    >
      <FooterDisplayButton />
      <FooterBody>
        <Follow
          id="newsletter-form"
          newsletter={{
            buttonProps: {
              type: 'submit',
              disabled: !email,
            },
            desc: (
              <>
                <span>Recevez toutes les informations de la Base Adresse Nationale !</span>
                <br /><br />
                <Link href="/newsletters">
                  Découvrez nos dernières newsletters
                </Link>
              </>),
            form: {
              formComponent: ({ children }) => <NewsletterOptinWithNoSSR showCatpcha={showCaptcha} handleSubmit={handleSubmit} onVerified={handleOptIn}>{children}</NewsletterOptinWithNoSSR>,
              successMessage: 'Vous êtes bien inscrit à la newsletter',
              success,
              inputProps: {
                value: email,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                type: 'email',
              } as any,
            },
          }}
          social={{
            buttons: [
              {
                linkProps: {
                  href: SOCIAL_NETWORKS_URL_BLUESKY as unknown as URL ?? '',
                  target: '_blank',
                  title: 'Suivez-nous sur Bluesky',
                },
                type: 'bluesky' as FollowProps.SocialType,
              },
              {
                linkProps: {
                  href: SOCIAL_NETWORKS_URL_MASTODON as unknown as URL ?? '',
                  target: '_blank',
                },
                type: 'mastodon',
              },
              {
                linkProps: {
                  href: SOCIAL_NETWORKS_URL_LINKEDIN as unknown as URL ?? '',
                  target: '_blank',
                },
                type: 'linkedin',
              },
              {
                linkProps: {
                  href: SOCIAL_NETWORKS_URL_FACEBOOK as unknown as URL ?? '',
                  target: '_blank',
                },
                type: 'facebook',
              },
              {
                linkProps: {
                  href: SOCIAL_NETWORKS_URL_GITHUB as unknown as URL ?? '',
                  target: '_blank',
                },
                type: 'github',
              },
              {
                linkProps: {
                  href: SOCIAL_NETWORKS_URL_RSS as unknown as URL ?? '',
                  target: '_blank',
                  title: 'Suivez nos flux RSS',
                },
                type: 'rss' as FollowProps.SocialType,
              },
            ],
          }}
        />
        <FooterDSFR
          brandTop={(
            <>
              RÉPUBLIQUE
              <br />
              FRANÇAISE
            </>
          )}
          accessibility="non compliant"
          operatorLogo={{
            alt: '[À MODIFIER - texte alternatif de l’image]',
            imgUrl: '/logo-ban-site.svg',
            orientation: 'vertical',
          }}
          contentDescription={(
            <>
              adresse<b>.data.gouv</b><i>.fr</i> &nbsp;-&nbsp; Le site national officiel de l’adresse. <br />
              Service public gratuit pour référencer l’intégralité des adresses du
              territoire et les rendre utilisables par tous. Retrouvez-y toutes
              les informations et démarches administratives nécessaires à la
              création et à la gestion des adresses.
            </>
          )}
          homeLinkProps={{
            href: '/',
            title: 'Adresse.data.gouv.fr - Accueil',
          }}
          accessibilityLinkProps={{
            href: '/accessibilite',
          }}
          termsLinkProps={{
            href: '/mentions-legales',
          }}
          partnersLogos={{
            main: {
              alt: 'Ministère de la transition écologique et de la cohésion des territoires',
              imgUrl: '/logos/LOGO-MINISTERE-ECOLOGIE.jpg',
              linkProps: {
                href: 'https://www.ecologie.gouv.fr/',
                target: '_blank',
                title: 'Lien vers le site du ministère de la transition écologique et de la cohésion des territoires',
              },
            },
            sub: [
              {
                alt: 'IGN - Institut national de l’information géographique et forestière',
                imgUrl: '/logos/LOGO-IGN.png',
                linkProps: {
                  href: 'https://www.ign.fr/',
                  target: '_blank',
                  title: 'Lien vers le site de l’IGN',
                },
              },
              {
                alt: 'Agence nationale de la cohésion des territoires',
                imgUrl: '/logos/LOGO-ANCT.png',
                linkProps: {
                  href: 'https://agence-cohesion-territoires.gouv.fr/',
                  target: '_blank',
                  title: 'Lien vers le site l’ANCT',
                },
              },
            ],
          }}
          bottomItems={[
            {
              text: 'CGU',
              linkProps: { href: '/cgu' },
            },
            {
              text: 'Données personnelles',
              linkProps: { href: '/donnees-personnelles' },
            },
            {
              text: 'Statistiques',
              linkProps: { href: '/stats' },
            },
            {
              text: 'Contact',
              linkProps: { href: '/nous-contacter' },
            },
            {
              text: 'Documentation',
              linkProps: {
                href: 'https://doc.adresse.data.gouv.fr/',
                target: '_blank',
              },
            },
            {
              text: 'Supervision BAN/BAL',
              linkProps: {
                href: 'https://status.adresse.data.gouv.fr/',
                target: '_blank',
              },
            },
            headerFooterDisplayItem,
          ]}
        />
      </FooterBody>
    </FooterWrapper>
  )
}
