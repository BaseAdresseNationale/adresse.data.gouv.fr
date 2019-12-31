import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import theme from '../styles/theme'
import DownloadIcon from './icons/download'
import ContributeIcon from './icons/contribute'
import ToolsIcon from './icons/tools'
import ExploreSearch from './explorer/explore-search'

const Hero = ({title, tagline}) => (
  <div className='hero'>
    <div className='hero-container'>
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

      <ExploreSearch />
    </div>
    <style jsx>{`
      .hero {
        min-height: 100vh;
        background: #fff url(/images/city-background.svg) bottom center no-repeat;
        background-size: cover;
        margin-bottom: -0.1em;
      }

      .hero-container {
        margin: auto;
        padding-top: 2em;
        max-width: 1000px;
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

      @media (max-width: 812px) {
        .hero {
          height: 800px;
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
