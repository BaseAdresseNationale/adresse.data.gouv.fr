import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import theme from '../styles/theme'
import DownloadIcon from './icons/download'
import ContributeIcon from './icons/contribute'
import ToolsIcon from './icons/tools'
import ExploreSearch from './explorer/explore-search'

import Container from './container'

const Hero = ({title, tagline}) => (
  <div className='hero'>
    <div className='hero-container'>
      <Container>
        <div style={{textAlign: 'center'}}>
          <h1 className='hero__white-background'>{title}</h1>
          <p className='hero__white-background'>{tagline}</p>
        </div>

        <div className='data-tools'>
          <Link href='/download'>
            <a>
              <DownloadIcon />Accéder aux données
            </a>
          </Link>
          <Link href='/contribuer'>
            <a>
              <ContributeIcon />Contribuer à la démarche
            </a>
          </Link>
          <Link href='/tools'>
            <a>
              <ToolsIcon />Découvrir les outils
            </a>
          </Link>
        </div>

        <div className='search-bar-home'>
          <ExploreSearch />
        </div>
      </Container>

    </div>
    <style jsx>{`
      .hero {
        height: 100vh;
        background: #fff url(/images/city-background.svg) bottom center no-repeat;
        background-size: cover;
        margin-bottom: -0.1em;
      }

      .hero-container {
        position: relative;
        top: 2em;
      }

      .data-tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        grid-gap: 2em 1em;
        margin: 2em 0;
        padding: 1em;
        background-color: white;
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

      @media (max-width: 700px) {
        .hero-container {
          position: absolute;
          top: 200px;
        }

        .hero {
          height: 145vh;
        }
      }

      @media (max-width: 288px) {
        .hero-container {
          margin-top: 6em;
        }
      }

      @media (max-width: 166px) {
        .hero-container {
          margin-top: 15em;
        }
      }
    `}</style>
  </div>
)

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
}

export default Hero
