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
          href: '/programme-bal',
        },
        text: 'Découvrez le programme Bases Adresses Locales',
      },
      {
        linkProps: {
          href: '/gerer-mes-adresses',
        },
        text: 'Comment mettre à jour mes adresses',
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
          href: '/ressources',
        },
        text: 'Ressources autour de l’adressage',
      },
      {
        linkProps: {
          href: '/evenements',
        },
        text: 'Evènements autour de l’adressage',
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
        text: 'Charte de la Base Adresse Locale',
      },
      {
        linkProps: {
          href: '/gerer-mes-adresses',
        },
        text: 'Comment mettre à jour les adresses',
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
          href: '/ressources',
        },
        text: 'Ressources autour de l’adressage',
      },
      {
        linkProps: {
          href: '/evenements',
        },
        text: 'Evènements autour de l’adressage',
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
      {
        linkProps: {
          href: '/contribuer#osmose',
        },
        text: 'Rejoignez le collectif des usagers',
      },
      {
        linkProps: {
          href: '/donnees-nationales/usages',
        },
        text: 'Usages',
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
