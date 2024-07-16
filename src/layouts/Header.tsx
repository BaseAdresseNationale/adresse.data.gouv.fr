'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { Header as HeaderDSFR } from '@codegouvfr/react-dsfr/Header'
import { MainNavigationProps } from '@codegouvfr/react-dsfr/MainNavigation'

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

const navEntries: MainNavigationProps.Item[] = [
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
        linkProps: { href: '/decouvrir_la_BAN' },
      },
      { text: 'Utiliser la BAN', linkProps: { href: '#' } },
      { text: 'Documentation', linkProps: { href: '#' } },
      {
        text: 'Documentation technique',
        linkProps: { href: '#' },
      },
      { text: 'Vidéos', linkProps: { href: '#' } },
      { text: 'État du déploiement', linkProps: { href: '#' } },
      { text: 'Statistiques', linkProps: { href: '#' } },
    ],
  },
  {
    text: 'Les communes',
    menuLinks: [
      {
        text: 'Votre commune et sa base adresse locale ',
        linkProps: { href: '#' },
      },
      { text: 'Ma commune', linkProps: { href: '#' } },
      {
        text: 'Application Mes adresses',
        linkProps: { href: '#' },
      },
      { text: 'Formation en ligne', linkProps: { href: '#' } },
    ],
  },
  {
    text: 'Les outils',
    menuLinks: [
      {
        text: 'Tous les outils et APIs',
        linkProps: { href: '#' },
      },
      {
        text: 'Carte de la Base adresse nationale',
        linkProps: { href: '#' },
      },
      { text: 'Certificat d’adresse', linkProps: { href: '#' } },
      { text: 'Signalement', linkProps: { href: '#' } },
      {
        text: 'Télécharger les données',
        linkProps: { href: '#' },
      },
      { text: 'Validateur BAL', linkProps: { href: '#' } },
      { text: 'Géocodeur', linkProps: { href: '#' } },
      { text: 'Publication', linkProps: { href: '#' } },
      { text: 'Supervision BAL/BAN', linkProps: { href: '#' } },
      { text: 'Fantoir', linkProps: { href: '#' } },
    ],
  },
  {
    text: 'L’actualité',
    menuLinks: [
      { text: 'Les événements', linkProps: { href: '#' } },
      {
        text: 'Le blog et les témoignages',
        linkProps: { href: '#' },
      },
      { text: 'L’Info-lettre', linkProps: { href: '#' } },
    ],
  },
  {
    text: 'La communauté',
    menuLinks: [
      { text: 'Découvrir la charte', linkProps: { href: '#' } },
      { text: 'Communes partenaires', linkProps: { href: '#' } },
      {
        text: 'Organismes partenaires',
        linkProps: { href: '#' },
      },
      {
        text: 'Entreprises partenaires',
        linkProps: { href: '#' },
      },
      { text: 'Nos usagers', linkProps: { href: '#' } },
    ],
  },
]

export default function Header() {
  const pathname = usePathname()

  const selectedNavigationLinks = useMemo(
    () => markAsActive(navEntries as MainNavigationProps.Item[], pathname),
    [pathname]
  )

  return (
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
            href: '#',
          },
          text: 'Documentation',
        },
        {
          iconId: 'ri-quill-pen-fill',
          linkProps: {
            href: '#',
          },
          text: 'Blog',
        },
        {
          iconId: 'fr-icon-message-2-fill',
          linkProps: {
            href: '#',
          },
          text: 'Nous contacter',
        },
      ]}
      navigation={selectedNavigationLinks as MainNavigationProps.Item[]}
    />
  )
}
