import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import {Download, Edit3} from 'react-feather'
import theme from '../styles/theme'
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
              <div className='circle'>
                <Download size={48} />
              </div>
              Accéder aux données
            </a>
          </Link>
          <Link href='/contribuer'>
            <a>
              <div className='circle'>
                <Edit3 size={48} />
              </div>
              Contribuer à la démarche
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
        min-height: 100vh;
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
