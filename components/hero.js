import React from 'react'
import PropTypes from 'prop-types'

import ExploreSearch from './explorer/explore-search'

const Hero = ({title, tagline}) => (
  <div className='hero'>
    <div className='container'>
      <h1 className='hero__white-background'>{title}</h1>
      <p className='hero__white-background'>{tagline}</p>
      <ExploreSearch />
    </div>
    <style jsx>{`
      .hero {
        background: #fff url(/static/images/city-background.svg) bottom center no-repeat;
        background-size: cover;
      }

      .container {
        height: 100vh;
        top: 3em;
        text-align: center;
      }
    `}</style>
  </div>
)

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
}

export default Hero
