import Link from 'next/link'
import Image from 'next/legacy/image'

import theme from '@/styles/theme'

import HamburgerMenu from './hamburger-menu'

const links = [
  {text: 'Données nationales', href: '/donnees-nationales'},
  {text: 'Contribuer', href: '/contribuer'},
  {text: 'Ressources', href: '/ressources'},
  {text: 'API', href: '/api-doc'},
  {text: 'Outils', href: '/outils'},
  {text: 'Blog', href: '/blog'},
  {text: 'Nous contacter', href: '/nous-contacter'}
]

function Header() {
  return (
    <nav className='nav template-data-gouv'>
      <div className='nav__container'>

        <Link href='/' legacyBehavior>
          <a className='nav__link'>
            <Image layout='responsive' width={424} height={100} src='/images/logos/logo-rf.svg' alt='Page d’accueil de adresse.data.gouv.fr' />
          </a>
        </Link>

        <ul className='nav__links'>
          {links.map(link => (
            <li key={link.text}>
              {link.isExternal ? (
                <a href={link.href}>{link.text}</a>
              ) : (
                <Link href={link.href} legacyBehavior><a>{link.text}</a></Link>
              )}
            </li>
          ))}
        </ul>

        <div className='hamburger-menu'>
          <HamburgerMenu links={links} />
        </div>

      </div>

      <style jsx>{`
      .nav {
        border-bottom: 1px solid ${theme.boxShadow};
        width: 100%;
        background: #fff;
        z-index: 100;
      }

      .nav-fixed {
        position: fixed;
        top: 0;
      }

      .nav__container {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
      }

      .nav__logo {
        display: block;
        width: 40%;
        max-width: 305px;
        margin: 0.2em 1em;
      }

      .nav__link {
        width: 40%;
        margin: .2em 1em;
        min-width: 220px;
        max-width: 424px;
      }

      .nav__link:hover {
        background-color: ${theme.colors.white};
      }

      .nav__links {
        display: flex;
        flex-flow: wrap;
        margin: 0;
        padding: 1em;
        list-style-type: none;
        text-align: right;
      }

      .nav__links li {
        padding: 0;
        display: inline;
        font-size: 1.1em;
      }

      .nav__links a,
      .nav__links .dropdown {
        text-decoration: none;
        color: ${theme.colors.black};
        padding: 0.4em 0.8em;
        border-radius: 3px;
      }

      .nav__links a::after {
        content: none;
      }

      .nav__links a:hover,
      .nav__links .dropdown:hover {
        background-color: ${theme.colors.lightGrey};
        transition: background ease-out 0.5s;
      }

      .nav__links a.active {
        background: ${theme.primary};
        color: ${theme.colors.white};
      }

      .hamburger-menu {
        display: none;
      }

      @media (max-width: ${theme.breakPoints.desktop}) {
        .nav__links {
          display: none;
        }

        .hamburger-menu {
          display: block;
          margin: 1em;
        }
      }
  `}</style>
    </nav>
  )
}

export default Header
