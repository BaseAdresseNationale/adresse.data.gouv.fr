import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

import theme from '../styles/theme'
import ExploreSearch from './explorer/explore-search'

import Section from './section'

const Hero = ({title, tagline}) => (
  <div className='hero'>
    <div className='container'>
      <h1 className='hero__white-background'>{title}</h1>
      <p className='hero__white-background'>{tagline}</p>
      <Section>
        <div className='data-tools'>
          <Link href='/download'>
            <a>
              <img
                src='/images/icons/download-2.svg'
              /> Accéder aux données
            </a>
          </Link>
          <Link href='/contribuer'>
            <a>
              <img
                src='/images/icons/contribute-2.svg'
              /> Contribuer à la démarche
            </a>
          </Link>
          <Link href='/tools'>
            <a>
              <img
                src='/images/icons/tools-2.svg'
              /> Découvrir les outils
            </a>
          </Link>
        </div>
      </Section>
      <ExploreSearch />
    </div>
    <style jsx>{`
      .hero {
        background: #fff url(/images/city-background-2.svg) bottom center no-repeat;
        background-size: cover;
        margin-bottom: -20em;
      }

      .data-tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        grid-gap: 2em 1em;
        margin: -4em 0;
      }

      .container {
        height: 100vh;
        top: 1em;
        text-align: center;
      }

      img {
        height: 50px;
        width: auto;
        margin-bottom: 15px;
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

    `}</style>
  </div>
)

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
}

export default Hero
