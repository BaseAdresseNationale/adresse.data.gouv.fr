import Link from 'next/link'
import Section from '../section'

import theme from '../../styles/theme'

export default () => (
  <Section
    background='color'
    title=''>
    <div className='main'>
      <Link href='/about'>
        <a>
          <img src='/static/images/icons/about.svg' alt='Données PCI Vecteur' />
          Pourquoi ? Comment ?
        </a>
      </Link>

      <Link href='/download'>
        <a>
          <img src='/static/images/icons/download.svg' alt='Données Cadastre simplifié' />
          Accéder aux données
        </a>
      </Link>

      <Link href='/contrib'>
        <a>
          <img src='/static/images/icons/contribute.svg' alt='Consulter le cadastre' />
          Contribuer au projet
        </a>
      </Link>

      <Link href='/tools'>
        <a>
          <img src='/static/images/icons/tools.svg' alt='Cartographie interactive' />
          Découvrir les outils
        </a>
      </Link>
    </div>

    <style jsx>{`
      .main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        grid-gap: 2em 1em;
      }

      .main div {
        text-align: center;
        font-size: 1.2em;
        padding: 0 2em;
      }

      i {
        color: ${theme.colors.white};
      }

      a, .muted {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-transform: uppercase;
        text-decoration: none;
        font-weight: 700;
        color: ${theme.backgroundWhite};
      }

      img {
        height: 100px;
        width: auto;
        margin-bottom: 15px;
      }

      .muted {
        opacity: 0.4;
      }
    `}</style>
  </Section>
)
