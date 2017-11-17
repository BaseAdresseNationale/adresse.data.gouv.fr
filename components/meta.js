import Head from 'next/head'

import theme from '../styles/theme'

import Fonts from './styles/fonts'

export default () => (
  <div>
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='x-ua-compatible' content='ie=edge' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />

      <title>Un référentiel national ouvert\u2009: de l’adresse à la coordonnée géographique - adresse.data.gouv.fr</title>

      <link rel='icon' href='/static/favicon.ico' />

      {/* Search Engine */}
      <meta name='description' content='Site officiel de la Base Adresse Nationale' />
      <meta name='image' content='https://cadastre.data.gouv.fr/static/images/previews/default.png' />

      {/* Schema.org for Google */}
      <meta itemProp='name' content='Données cadastrales ouvertes' />
      <meta itemProp='description' content='Consulter, télécharger et intégrer les données cadastrales sans effort' />
      <meta itemProp='image' content='https://cadastre.data.gouv.fr/static/images/previews/default.png' />

      {/* Twitter */}
      <meta name='twitter:image' content='{{ site.url }}/img/logo_marianne_share.jpeg' />

      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content='adresse.data.gouv.fr, Un référentiel national ouvert\u2009: de l’adresse à la coordonnée géographique' />
      <meta name='twitter:description' content='Site officiel de la Base Adresse Nationale' />
      <meta name='twitter:site' content='@BaseAdresse' />
      <meta name='twitter:image:src' content='/static/images/logos/logo-adresse.svg' />

      {/* Open Graph general (Facebook, Pinterest & Google+) */}
      <meta name='og:title' content='adresse.data.gouv.fr, Un référentiel national ouvert\u2009: de l’adresse à la coordonnée géographique' />
      <meta name='og:description' content='Site officiel de la Base Adresse Nationale' />
      <meta name='og:image' content='/static/images/logos/logo-adresse.svg' />
      <meta name='og:url' content='https://adresse.data.gouv.fr' />
      <meta name='og:site_name' content='adresse.data.gouv.fr' />
      <meta name='og:locale' content='fr_FR' />
      <meta name='og:type' content='website' />
    </Head>

    <Fonts />

    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        padding: 0;
        margin: 0;
        position: relative;
        overflow: auto;
        font-family: 'Source Sans Pro', Arial, sans-serif;
        font-size: 15px;
        background: ${theme.backgroundGrey};
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: Evolventa, 'Trebuchet MS', sans-serif;
      }

      a,
      button {
        outline: none;
      }

      a,
      a:hover,
      a:focus,
      a:visited,
      a:active {
        color: ${theme.primary};
      }

      pre {
        font-size: 12px;
        background-color: #ddd;
        border: solid 1px #ccc;
        width: 95%;
        overflow: auto;
        padding: 10px;
    }
    `}</style>
  </div>
)
