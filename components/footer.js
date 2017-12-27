import Link from 'next/link'

import theme from '../styles/theme'

const Footer = () => (
  <footer className='footer'>
    <div className='container'>
      <div className='footer__logo'>
        <img src='/static/images/logos/etalab.svg' />
        <ul className='footer__social'>
          <li><Link href='https://twitter.com/AdresseDataGouv'><a><img src='/static/images/medias/twitter.svg' alt='Twitter' /></a></Link></li>
          <li><Link href='https://github.com/etalab/adresse.data.gouv.fr'><a><img src='/static/images/medias/github.svg' alt='Github' /></a></Link></li>
          <li><Link href='https://blog.geo.data.gouv.fr'><a><img src='/static/images/medias/medium.svg' alt='Medium' /></a></Link></li>
          <li><a href='mailto:contact@adresse.data.gouv.fr'><img src='/static/images/medias/envelop.svg' alt='Contact' /></a></li>
        </ul>
      </div>
      <ul className='footer__links'>
        <li><h2>adresse.data.gouv.fr</h2></li>
        <li><Link href='/about'><a>À propos</a></Link></li>
        <li><Link href='/cgu'><a>Mentions légales et CGU</a></Link></li>
        <li><Link href='/faq'><a>FAQ</a></Link></li>
        <li><a href='mailto:contact@adresse.data.gouv.fr'>Contact</a></li>
      </ul>
    </div>
    <style jsx>{`
      .footer {
        background: ${theme.colors.almostBlack};
        color: ${theme.colors.white};
        padding: 2em 0;
        line-height: 2em;
      }

      .footer .container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 2em;
        flex-wrap: wrap;
      }

      .footer__logo img {
        width: 160px;
      }

      .footer ul {
        list-style-type: none;
        padding: 0;
      }

      .footer__social {
        margin-top: 1em;
      }

      .footer__social li {
        display: inline;
        margin-right: 1em;
      }

      .footer__social img {
        width: 25px;
      }

      .footer__links {
        margin: 0;
      }

      .footer__links a {
        color: ${theme.colors.white};
        text-decoration: none;
      }

      .footer__links h2 {
        margin-top: 0;
        margin-bottom: 0.5em;
      }
      `}</style>
  </footer>
)

export default Footer
