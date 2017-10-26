import PropTypes from 'prop-types'

import theme from '../styles/theme'

const Hero = ({title, tagline}) => (
  <div>
    <h1>{title}</h1>
    <p>{tagline}</p>

    <style jsx>{`
      div {
        height: 38vh;
        min-height: 18em;
        width: 100%;
        color: ${theme.colors.white};
        background-color: ${theme.backgroundWhite};
        background-blend-mode: darken;
        background-image: url(/static/images/background.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-attachment: fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: ${theme.darkText};
      }

      h1, p {
        padding: 10px 1em;
        background-color: white;
      }

      h1 {
        margin: 0 0 0.5em;
        text-transform: uppercase;
      }

      p {
        margin: 0;
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
