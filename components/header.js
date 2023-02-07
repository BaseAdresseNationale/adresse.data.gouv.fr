import {useMemo} from 'react'
import {useRouter} from 'next/router'
import {Header as HeaderDsfr} from '@codegouvfr/react-dsfr/Header'

const quickLinks = [
  {icon: 'ri-tools-fill', text: 'Outils et API', href: '/outils'},
  {icon: 'ri-quill-pen-fill', text: 'Blog et témoignages', href: '/blog'},
  {icon: 'ri-discuss-fill', text: 'Nous contacter', href: '/nous-contacter'},
]

const navigationLinks = [
  {
    linkProps: {
      href: '/donnees-nationales',
    },
    text: 'Accéder aux données',
  },
  {
    linkProps: {
      href: '/contribuer',
    },
    text: 'Contribuer',
  },
  {
    text: 'Communes et Collectivités',
    menuLinks: [
      {
        linkProps: {
          href: '/ressources',
        },
        text: 'Ressources autour de l’adressage',
      },
      {
        linkProps: {
          href: '/gerer-mes-adresses',
        },
        text: 'Gérer mes adresses',
      },
      {
        linkProps: {
          href: 'https://mes-adresses.data.gouv.fr/',
          target: '_blank',
        },
        text: 'Outil national "Mes Adresses"',
      },
      {
        linkProps: {
          href: '/evenements',
        },
        text: 'Les évènements de l’adresse',
      },
    ]
  },
  {
    text: 'Partenaires',
    menuLinks: [
      {
        linkProps: {
          href: '/bases-locales/charte',
        },
        text: 'La charte des partenaires',
      },
      {
        linkProps: {
          href: '/ressources',
        },
        text: 'Ressources autour de l’adressage',
      },
      {
        linkProps: {
          href: '/gerer-mes-adresses',
        },
        text: 'Gérer les adresses',
      },
      {
        linkProps: {
          href: 'https://mes-adresses.data.gouv.fr/',
          target: '_blank',
        },
        text: 'Outil national "Mes Adresses"',
      },
      {
        linkProps: {
          href: '/bases-locales/publication',
        },
        text: 'Formulaire de dépôt BAL',
      },
      {
        linkProps: {
          href: '/evenements',
        },
        text: 'Les évènements de l’adresse',
      },
    ]
  },
  {
    text: 'Utilisateurs',
    menuLinks: [
      {
        linkProps: {
          href: '/donnees-nationales',
        },
        text: 'Accéder aux données',
      },
      {
        linkProps: {
          href: '/outils',
        },
        text: 'Consulter les outils',
      },
      {
        linkProps: {
          href: '/api-doc',
        },
        text: 'Utiliser les API de l’adresse',
      },
      {
        linkProps: {
          href: '/deploiement-bal',
        },
        text: 'État du déploiement des Bases Adresses Locales',
      },
    ]
  },
]

const markAsActive = (navigation, route) => {
  return navigation.map(navEntry => {
    const menuLinks = navEntry?.menuLinks ? markAsActive(navEntry.menuLinks, route, navEntry?.text) : undefined
    const menuLinksActive = menuLinks?.some(({isActive}) => isActive === true)
    return ({
      ...navEntry,
      isActive: menuLinksActive ?? route === navEntry?.linkProps?.href,
      menuLinks
    })
  })
}

function Header() {
  const {route} = useRouter()

  const selectedNavigationLinks = useMemo(
    () => markAsActive(navigationLinks, route),
    [route],
  )

  return (
    <>
      <HeaderDsfr
        brandTop={
          <>
            République
            <br />
            française
          </>
        }
        homeLinkProps={{
          href: '/',
          title:
          'Accueil - Nom de l’entité (ministère, secrétariat d‘état, gouvernement)',
        }}
        serviceTagline='Le site national de l’adresse'
        serviceTitle={<span className='ban-service-title'>adresse<b>.data.gouv</b><i>.fr</i></span>}
        quickAccessItems={quickLinks.map(({icon, href, text}) => (
          {
            iconId: icon,
            linkProps: {
              href,
            },
            text,
          }
        ))}
        navigation={selectedNavigationLinks}
      />
      <style jsx>{`
        .ban-service-title {
          white-space: nowrap;
          font-weight: 400;
        }
      `}</style>
    </>
  )
}

export default Header
