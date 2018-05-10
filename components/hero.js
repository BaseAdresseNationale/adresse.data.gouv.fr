import PropTypes from 'prop-types'

import theme from '../styles/theme'

const Hero = ({title, tagline}) => (
  <div className='hero'>
    <div className='hero__container'>
      <h1 className='hero__white-background'>{title}</h1>
      <p className='hero__white-background'>{tagline}</p>
    </div>
    <style jsx>{`
      .hero {
        width: 100%;
        color: ${theme.colors.white};
        background-color: ${theme.backgroundWhite};
        background-blend-mode: darken;
        background-image: url(/static/images/background.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
      }

      .hero__container {
        height: 38vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
      }

      .hero__white-background {
        padding: 10px 1em;
        background-color: ${theme.colors.white};
      }

      .hero h1 {
        color: ${theme.darkText};
        margin: 0;
      }

      .hero p {
        margin: 1em 0 0;
        color: ${theme.darkText};
        font-size: 1.2em;
        font-style: italic;
      }
    `}</style>
  </div>
)

Hero.propTypes = {
  title: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired
}

export default Hero
