import PropTypes from 'prop-types'
import {Download, Edit3} from 'react-feather'

import theme from '@/styles/theme'

import ToolsIcon from './icons/tools'
import Container from './container'
import CircleLink from './circle-link'

function Hero({title, tagline}) {
  return (
    <div className='hero'>
      <Container>
        <div style={{textAlign: 'center'}}>
          <h1 className='hero__white-background'>{title}</h1>
          <p className='hero__white-background'>{tagline}</p>
        </div>

        <div className='data-tools'>
          <CircleLink
            href='/contribuer'
            icon={<Edit3 size={48} color={theme.colors.white} />}
            isImportant
            size='80'
          >
            Contribuer à la démarche
          </CircleLink>

          <CircleLink
            href='/tools'
            icon={<ToolsIcon size={48} color={theme.colors.white} />}
            isImportant
            size='80'
          >
            Découvrir les outils
          </CircleLink>

          <CircleLink
            href='/download'
            icon={<Download size={48} color={theme.colors.white} />}
            isImportant
            size='80'
          >
            Accéder aux données
          </CircleLink>
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
          background: url('/images/automn-background.svg') bottom no-repeat;
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
