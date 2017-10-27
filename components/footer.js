import theme from '../styles/theme'

const Footer = () => (
  <footer className='footer'>
    <div className='container'>
      <div className='footer__logo'>
        <img src='static/images/logos/etalab.svg' />
        <ul className='footer__social'>
          <li><a href='https://www.twitter.com/etalab'><img src='static/images/medias/twitter.svg' alt='Twitter' /></a></li>
          <li><a href='https://www.github.com/etalab'><img src='static/images/medias/github.svg' alt='Github' /></a></li>
          <li><a href='https://www.facebook.com/etalab'><img src='static/images/medias/facebook.svg' alt='Facebook' /></a></li>
          <li><a href='mailto:info@data.gouv.fr'><img src='static/images/medias/envelop.svg' alt='Contact' /></a></li>
        </ul>
      </div>
      <ul className='footer__links'>
        <li><h2>adresse.data.gouv.fr</h2></li>
        <li><a href='/about'>À propos</a></li>
        <li><a href='/cgu'>Mentions légales et CGU</a></li>
        <li><a href='/faq'>FAQ</a></li>
        <li><a href='/contact'>Contact</a></li>
      </ul>
    </div>
    <style jsx>{`
      .footer {
        background: ${theme.backgroundDark};
        color: ${theme.colors.white};
        padding: 2em 0;
        line-height: 2em;
      }

      .footer .container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
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
