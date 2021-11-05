import Link from 'next/link'
import PropTypes from 'prop-types'
import {Download, Edit3} from 'react-feather'

import theme from '@/styles/theme'

import ToolsIcon from './icons/tools'
import Container from './container'

function Hero({title, tagline}) {
  return (
    <div className='hero'>
      <Container>
        <div style={{textAlign: 'center'}}>
          <h1 className='hero__white-background'>{title}</h1>
          <p className='hero__white-background'>{tagline}</p>
        </div>

        <div className='data-tools'>
          <Link href='/contribuer'>
            <a>
              <div className='circle'>
                <Edit3 size={48} color={theme.colors.white} />
              </div>
              Contribuer à la démarche
            </a>
          </Link>
          <Link href='/tools'>
            <a>
              <div className='circle'>
                <ToolsIcon color={theme.colors.white} />
              </div>
              Découvrir les outils
            </a>
          </Link>
          <Link href='/download'>
            <a>
              <div className='circle'>
                <Download size={48} color={theme.colors.white} />
              </div>
              Accéder aux données
            </a>
          </Link>
        </div>
      </Container>

      <div className='frise' />

      <style jsx>{`
        .hero {
          padding-top: 2em;
          min-height: 100vh;
          background: ${theme.colors.white};
          display: flex;
          flex-direction: column;
        }

        .frise {
          background: #fff url('/images/automn-background.svg') bottom no-repeat;
          background-size: cover;
          height: 430px;
          margin-bottom: -0.2em;
          flex: 1;
        }

        .data-tools {
          min-height: 260px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          align-items: center;
          gap: 3em;
        }

        a {
          display: flex;
          gap: 10px;
          height: fit-content;
          padding: 10px 0;
        }

        .circle {
          background: ${theme.primary};
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a, .muted {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 700;
          color: ${theme.darkText};
        }

        .map-button {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          overflow: visible;
          margin: .5em;
          text-align: center;
        }

        .example {
          font-size: 1.5em;
          text-align: center;
          padding: .5em;
          background-color: ${theme.colors.white};
        }
      `}</style>
    </div>
  )
}

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
}

export default Hero
