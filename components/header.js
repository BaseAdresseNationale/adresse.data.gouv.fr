import Link from 'next/link'

import theme from '../styles/theme'

export default () => (
  <nav className='nav'>
    <div className='nav__container'>
      <Link href='/'>
        <a><img className='nav__logo' src='/static/images/logos/logo-adresse.svg' alt='Accueil de adresse.data.gouv.fr' /></a>
      </Link>
      <ul className='nav__links'>
        <li><Link href='/about'><a>Infos</a></Link></li>
        <li><Link href='/download'><a>Données</a></Link></li>
        <li><Link href='/contrib'><a>Contribuer</a></Link></li>
        <li><Link href='/tools'><a>Outils</a></Link></li>
        <li><Link href='/news'><a>Actu</a></Link></li>
      </ul>
    </div>

    <style jsx>{`
      .nav {
        box-shadow: 0 1px 4px ${theme.boxShadow};
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

      .nav__home,
      .nav__logo {
        height: 70px;
        padding: 1em;
      }

      .nav__links {
        display: inline;
        margin: 0;
        padding: 1em;
        list-style-type: none;
        text-align: right;
      }

      .nav__links li + li {
        padding-left: 15px;
      }

      .nav__links li {
        padding: 0;
        display: inline;
      }

      .nav__links a {
        color: ${theme.colors.black};
        text-decoration: none;
      }

      .side-nav,
      .button-collapse {
        display: none;
      }

      @media (max-width: 550px) {
        .nav__links {
          padding-top: 0;
        }
      }
    `}</style>
  </nav>
)
