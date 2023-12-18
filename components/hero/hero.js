import Link from 'next/link'
import BanSearch from '@/components/ban-search'
import Container from '@/components/container'
import theme from '@/styles/theme'
import HeroMenu from '../hero/hero-menu'

function Hero() {
  return (
    <div className='hero'>
      <div className='hero-container'>
        <Container>
          <h1 className='home-title'>
            <strong>Le site national de l’adresse</strong> est
            le <strong className='home-title-note'>service public gratuit</strong> pour
            référencer <strong>l’intégralité des adresses du territoire</strong> et
            les rendre <strong>utilisables par tous</strong>.
          </h1>

          <div className='home-search-block'>
            <p className='example'>Rechercher une adresse, une voie, un lieu-dit ou une commune dans la Base Adresse Nationale</p>
            <BanSearch />
            <div className='map-button'>
              <Link className='fr-link  fr-link--lg fr-link--icon-right fr-icon-arrow-right-line' href='/base-adresse-nationale'>
                Visiter notre cartographie
              </Link>
            </div>
          </div>
          <HeroMenu />
        </Container>
      </div>

      <style jsx>{`
        .home-title {
          box-sizing: border-box;
          font-size: 2rem;
          line-height: 1.6em;
          max-width: 25em;
          margin: 3rem auto;
          text-align: center;
        }
        .home-title .home-title-note {
          color: var(--green-emeraude-main-632);
        }
        .home-title strong {
          color: var(--info-425-625);
        }

        @media (min-width: ${theme.breakPoints.tablet}) {
          .home-search-block {
            margin: 6rem;
          }
        }
        .home-search-block .example {
          font-size: 1.1em;
          text-align: center;
          padding: .5em;
        }
        .home-search-block .map-button {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          overflow: visible;
          margin: 0 0 2em;
          text-align: center;
        }



        .hero {
          background: ${theme.colors.white};
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1em;
        }
        .hero-container {
          position: relative;
          margin: 1em 0 2em;
        }

      `}</style>
    </div>
  )
}

export default Hero
