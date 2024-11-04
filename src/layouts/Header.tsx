'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { Header as HeaderDSFR } from '@codegouvfr/react-dsfr/Header'
import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation'
import Notices from '@/components/Notices'

import dataNotices from '@/data/sample-notices.json'

const URL_CARTOGRAPHY_BAN = process.env.NEXT_PUBLIC_URL_CARTOGRAPHY_BAN

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
      { text: 'Utiliser la BAN', linkProps: { href: '/utiliser-la-ban' } },
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
        text: 'Consulter la page commune',
        linkProps: { href: '/commune' },
      },
      {
        text: 'Application Mes adresses',
        linkProps: {
          href: 'https://mes-adresses.data.gouv.fr/',
          target: '_blank',
        },
      },
      { text: 'Formation en ligne', linkProps: { href: '/formation-en-ligne' } },
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
        text: 'Carte de la Base adresse nationale',
        linkProps: { href: `${URL_CARTOGRAPHY_BAN}` },
      },
      // { text: 'Certificat d’adresse', linkProps: { href: '#' } },
      // { text: 'Signalement', linkProps: { href: '#' } },
      {
        text: 'Télécharger les données',
        // linkProps: { href: '/donnees-nationales' }, // TODO: Use redirection
        linkProps: { href: '/outils/telechargements' },
      },
      { text: 'Validateur BAL', linkProps: { href: '/outils/validateur-bal' } },
      // { text: 'Géocodeur', linkProps: { href: '#' } },
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
      { text: 'L’Info-lettre', linkProps: { href: '#' } },
    ],
  },
  {
    text: 'La communauté',
    menuLinks: [
      { text: 'Charte de la Base adresse locale', linkProps: { href: '/communaute/charte-base-adresse-locale' } },
      { text: 'Communes partenaires', linkProps: { href: '/communaute/communes-partenaires' } },
      {
        text: 'Organismes partenaires',
        linkProps: { href: '/communaute/organismes-partenaires' },
      },
      {
        text: 'Sociétés partenaires',
        linkProps: { href: '/communaute/societes-partenaires' },
      },
      { text: 'Nos usagers', linkProps: { href: '/usages' } },
    ],
  },
]

export default function Header() {
  const pathname = usePathname()

  const selectedNavigationLinks = useMemo(
    () => markAsActive(navEntries as MainNavigationProps.Item[], pathname || ''),
    [pathname]
  )

  return (
    <>
      <HeaderDSFR
        id="fr-header-header-with-quick-access-items-nav-items-and-search-engine"
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
          'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)',
        }}
        operatorLogo={{
          alt: '[À MODIFIER - texte alternatif de l’image]',
          imgUrl: '/logo-ban-site.svg',
          orientation: 'vertical',
        }}
        quickAccessItems={[
          {
            iconId: 'fr-icon-book-2-fill',
            linkProps: {
              href: '/ressources-et-documentations',
            },
            text: 'Documentation',
          },
          {
            iconId: 'ri-quill-pen-fill',
            linkProps: {
              href: '/blog',
            },
            text: 'Blog',
          },
          {
            iconId: 'fr-icon-message-2-fill',
            linkProps: {
              href: '/nous-contacter',
            },
            text: 'Nous contacter',
          },
        ]}
        navigation={selectedNavigationLinks as MainNavigationProps.Item[]}
      />
      <Notices {...dataNotices} />
    </>
  )
}
