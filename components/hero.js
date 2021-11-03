import {useCallback} from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import {Download, Edit3} from 'react-feather'

import theme from '@/styles/theme'

import ToolsIcon from './icons/tools'
import Container from './container'

function Hero({title, tagline}) {
  const changeBackground = useCallback(() => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1

    if ((month >= 3 && day >= 20) || (month <= 6 && day < 21)) {
      return '/images/spring-background.svg'
    }

    if ((month >= 6 && day >= 21) || (month <= 9 && day < 23)) {
      return '/images/summer-background.svg'
    }

    if ((month >= 9 && day >= 22) || (month <= 12 && day < 21)) {
      return '/images/automn-background.svg'
    }

    if ((month >= 12 && day >= 21) || (month <= 3 && day < 20)) {
      return '/images/winter-background.svg'
    }
  }, [])

  return (
    <div className='hero'>
      <div className='hero-container'>
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
      </div>

      <style jsx>{`
      .hero {
        min-height: 100vh;
        background: #fff url(${changeBackground()}) bottom no-repeat;
        background-size: 100%;
        margin-bottom: -0.1em;
      }

      .hero-container {
        position: relative;
        top: 2em;
      }

      .data-tools {
        min-height: 260px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        align-items: center;
        grid-gap: 2em 1em;
        background-color: white;
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
