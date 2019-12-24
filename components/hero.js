import React from 'react'
import PropTypes from 'prop-types'
import ExploreSearch from './explorer/explore-search'
import OpenLicenceRibbon from './open-licence-ribbon'

const Hero = ({title, tagline, noscript}) => (
  <div className='hero'>
    <OpenLicenceRibbon />
    <div className='container'>
      <noscript className='noscript'>{noscript}</noscript>
      <h1 className='hero__white-background'>{title}</h1>
      <p className='hero__white-background'>{tagline}</p>
      <ExploreSearch />
    </div>
    <style jsx>{`
      .hero {
        background: #fff url(/images/city-background.svg) bottom center no-repeat;
        background-size: cover;
      }

      .container {
        height: 100vh;
        top: 1em;
        text-align: center;
      }

      .noscript{
        color: red;
        font-size: 20px;
        font-weight: bold;
        position: relative;
        top: -0.5em;
      }
    `}</style>
  </div>
)

Hero.propTypes = {
  noscript: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
}

export default Hero
