import PropTypes from 'prop-types'
import {Download, Edit3, Database} from 'react-feather'

import theme from '@/styles/theme'

import ToolsIcon from './icons/tools'
import BanSearch from './ban-search'
import Container from './container'
import ButtonLink from './button-link'
import CircleLink from './circle-link'
import Frise from './frise'

function Hero({title, tagline}) {
  return (
    <div className='hero'>
      <div className='hero-container'>
        <Container>
          <div style={{textAlign: 'center'}}>
            <h1 className='hero__white-background'>{title}</h1>
            <p className='hero__white-background'>{tagline}</p>
          </div>

          <div className='data-tools'>
            <CircleLink
              href='/download'
              icon={<Download size={48} color={theme.colors.white} />}
              isImportant
              size='80'
            >
              Accéder aux données
            </CircleLink>
            <CircleLink
              href='/contribuer'
              icon={<Edit3 size={48} color={theme.colors.white} />}
              isImportant
              size='80'
            >
              Contribuer à la démarche
            </CircleLink>
            <CircleLink
              href='/bases-locales'
              icon={<Database size={48} color={theme.colors.white} />}
              isImportant
              size='80'
            >
              Bases Adresses Locales
            </CircleLink>
            <CircleLink
              href='/tools'
              icon={<ToolsIcon size={48} color={theme.colors.white} />}
              isImportant
              size='80'
            >
              Découvrir les outils
            </CircleLink>
          </div>

          <p className='example'>Rechercher une adresse, une voie, un lieu-dit ou une commune dans la Base Adresse Nationale</p>

          <BanSearch />
          <div className='map-button'>
            <ButtonLink href='/base-adresse-nationale'>
              Accéder directement à la carte
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Frise />

      <style jsx>{`
        .hero {
          padding-top: 2em;
          min-height: 100vh;
          background: ${theme.colors.white};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
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

        a {
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
          margin: 2em;
          text-align: center;
        }

        .example {
          font-size: 1.1em;
          text-align: center;
          padding: .5em;
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
