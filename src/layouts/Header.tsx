'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { env } from 'next-runtime-env'
import { Header as HeaderDSFR } from '@codegouvfr/react-dsfr/Header'
import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'

import Notices from '@/components/Notices'
import { useMainLayout } from './MainLayout'

import {
  HeaderWrapper,
  CornerRibbons,
} from './Header.styles'
import Badge from '@codegouvfr/react-dsfr/Badge'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

const markAsActive = (
  navigation: MainNavigationProps.Item[],
  route: string
): MainNavigationProps.Item[] => {
  return navigation.map((navEntry) => {
    const menuLinks = navEntry?.menuLinks
      ? markAsActive(navEntry.menuLinks, route)
      : undefined
    const menuLinksActive = menuLinks?.some(
      ({ isActive }: MainNavigationProps.Item) => isActive === true
    )
    return {
      ...navEntry,
      isActive: menuLinksActive ?? route === navEntry?.linkProps?.href,
      menuLinks,
    }
  }) as MainNavigationProps.Item[]
}

export const navEntries: MainNavigationProps.Item[] = [
  {
    text: 'Accueil',
    linkProps: {
      href: '/',
      target: '_self',
    },
  },
  {
    text: 'La BAN',
    menuLinks: [
      {
        text: 'Découvrir la Base Adresse Nationale',
        linkProps: { href: '/decouvrir-la-BAN' },
      },
      { text: 'Contenu de la BAN', linkProps: { href: '/contenu-de-la-ban' } },
      { text: 'Documentation', linkProps: { href: '/ressources-et-documentations' } },
      { text: 'État du déploiement', linkProps: { href: '/deploiement-bal' } },
      { text: 'Statistiques', linkProps: { href: '/stats' } },
    ],
  },
  {
    text: 'Les communes',
    menuLinks: [
      {
        text: 'Découvrir le programme Base Adresse Locale',
        linkProps: { href: '/programme-bal' },
      },
      {
        text: 'Consulter la page d’une commune',
        linkProps: { href: '/commune' },
      },
      { text: 'Webinaires et tutoriels', linkProps: { href: '/formation-en-ligne' } },
      {
        text: 'Documentation adressage',
        linkProps: { href: '/documentation-bal' },
      },
      {
        text: 'Application Mes adresses',
        linkProps: {
          href: 'https://mes-adresses.data.gouv.fr/',
          target: '_blank',
        },
      },
    ],
  },
  {
    text: 'Les outils',
    menuLinks: [
      {
        text: 'Tous les outils et APIs',
        linkProps: { href: '/outils' },
      },
      {
        text: 'Carte de la Base adresse nationale (Explorateur)',
        linkProps: { href: `${URL_CARTOGRAPHY_BAN}` },
      },
      // { text: 'Certificat d’adresse', linkProps: { href: '#' } },
      // { text: 'Signalement', linkProps: { href: '#' } },
      {
        text: 'Télécharger les données',
        linkProps: { href: '/outils/telechargements' },
      },
      { text: 'Service géocodage de la Géoplateforme', linkProps: { href: '/outils/api-doc/adresse' } },
      { text: 'Géocodeur CSV', linkProps: { href: '/outils/csv' } },
      { text: 'Validateur BAL', linkProps: { href: '/outils/validateur-bal' } },
      { text:
        (
          <>
            Mise en forme BAL{' '}
            <Badge noIcon severity="info">BETA</Badge>
          </>
        ), linkProps: { href: '/outils/mise-en-forme' } },
      { text: 'Formulaire de publication', linkProps: { href: '/outils/formulaire-de-publication' } },
      {
        text: 'Supervision BAN/BAL',
        linkProps: {
          href: 'https://status.adresse.data.gouv.fr/',
          target: '_blank',
        },
      },
      // { text: 'Fantoir', linkProps: { href: '#' } },
    ],
  },
  {
    text: 'L’actualité',
    menuLinks: [
      { text: 'Les événements', linkProps: { href: '/evenements' } },
      {
        text: 'Le blog et les témoignages',
        linkProps: { href: '/blog' },
      },
      { text: 'L’Info-lettre', linkProps: { href: '/newsletters' } },
    ],
  },
  {
    text: 'La communauté',
    menuLinks: [
      { text: 'Charte de la Base adresse locale', linkProps: { href: '/communaute/charte-base-adresse-locale' } },
      {
        text: 'Organismes partenaires',
        linkProps: { href: '/communaute/organismes-partenaires' },
      },
      { text: 'Communes partenaires', linkProps: { href: '/communaute/communes-partenaires' } },
      {
        text: 'Annuaire des prestatataires',
        linkProps: { href: '/communaute/annuaire-des-prestataires' },
      },
      { text: 'Nos usagers', linkProps: { href: '/communaute/usages' } },
    ],
  },
]

interface Notices {
  data: {
    text: React.ReactNode
    link?: {
      href: string
      target?: string
    }
  }[]
  duration: number
}

interface HeaderProps {
  notices?: Notices
  isBeta?: boolean
}

export default function Header(
  {
    notices = {
      data: [],
      duration: 4000,
    },
    isBeta, // TODO : Use env variable
  }: HeaderProps
) {
  const { typeLayout } = useMainLayout()
  const pathname = usePathname()

  const selectedNavigationLinks = useMemo(
    () => markAsActive(navEntries as MainNavigationProps.Item[], pathname || ''),
    [pathname]
  )

  const size = useMemo(() => (typeLayout === 'default' ? 'default' : 'small'), [typeLayout])

  return (
    <HeaderWrapper $size={size} $withNotice={notices && notices.data.length > 0}>
      <div className="header-spacer" />
      {isBeta && <CornerRibbons>Version βετα</CornerRibbons>}
      <HeaderDSFR
        id="fr-header-header-with-quick-access-items-nav-items-and-search-engine"
        className="dsfr-header"
        brandTop={(
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        )}
        serviceTitle={(
          <>
            adresse.
            <b>data.gouv</b>
            <i>.fr</i>
          </>
        )}
        serviceTagline="Le site national de l’adresse"
        homeLinkProps={{
          href: '/',
          title:
          'Accueil - Base Adresse Nationale (Gouvernement Français)',
        }}
        operatorLogo={{
          alt: 'Logo de la Base Adresse Nationale (BAN)',
          imgUrl: '/logo-ban-site.svg',
          orientation: 'vertical',
        }}
        quickAccessItems={[
          {
            iconId: 'fr-icon-road-map-fill',
            linkProps: {
              href: '/carte-base-adresse-nationale',
            },
            text: <Tooltip kind="hover" title="Carte de la Base adresse nationale (Explorateur)">La Carte</Tooltip>,
          },
          {
            iconId: 'fr-icon-book-2-fill',
            linkProps: {
              href: '/documentation-bal',
            },
            text: <Tooltip kind="hover" title="Ressources & Documentations">La Documentation</Tooltip>,
          },
          {
            iconId: 'ri-quill-pen-fill',
            linkProps: {
              href: '/blog',
            },
            text: <Tooltip kind="hover" title="Le blog et les témoignages">Le Blog</Tooltip>,
          },
        ]}
        navigation={selectedNavigationLinks as MainNavigationProps.Item[]}
      />
      {notices && notices.data.length > 0 && <Notices className="dsfr-notice" {...notices} />}
    </HeaderWrapper>
  )
}
