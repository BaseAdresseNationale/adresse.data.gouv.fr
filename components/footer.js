import React from 'react'
import Link from 'next/link'

import theme from '../styles/theme'

const Footer = () => (
  <footer className='footer'>
    <div className='footer-container'>
      <div className='footer__logo'>
        <img src='/images/logos/etalab.svg' alt='Etalab' />
        <ul className='footer__social'>
          <li><a href='https://twitter.com/AdresseDataGouv'><img src='/images/medias/twitter.svg' alt='Twitter' /></a></li>
          <li><a href='https://github.com/etalab/adresse.data.gouv.fr'><img src='/images/medias/github.svg' alt='Github' /></a></li>
          <li><a href='https://blog.geo.data.gouv.fr'><img src='/images/medias/medium.svg' alt='Medium' /></a></li>
          <li><Link href='/nous-contacter'><a><img src='/images/medias/envelop.svg' alt='Nous contacter' /></a></Link></li>
        </ul>
      </div>
      <ul className='footer__links'>
        <li><h2>adresse.data.gouv.fr</h2></li>
        <li><Link href='/cgu'><a>Mentions légales et CGU</a></Link></li>
        <li><Link href='/faq'><a>FAQ</a></Link></li>
        <li><Link href='/nous-contacter'><a>Nous contacter</a></Link></li>
      </ul>
    </div>
    <style jsx>{`
      .footer {
        background: ${theme.colors.almostBlack};
        color: ${theme.colors.white};
        padding: 2em 0;
        line-height: 2em;
      }

      .footer .footer-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
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
