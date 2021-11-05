import Link from 'next/link'
import {Database, FileText, MapPin} from 'react-feather'

import theme from '@/styles/theme'

import BanSearch from '@/components/ban-search'

function HomepageTools() {
  return (
    <div className='tools-wrapper'>
      <div className='tool-container'>
        <p>Rechercher les adresses d’une commune</p>
        <BanSearch />
      </div>

      <div className='tool-container'>
        <p>Vous pouvez également...</p>
        <div className='tools-link'>
          <Link href='/gerer-mes-adresses'>
            <a>
              <div className='circle'>
                <MapPin size={38} />
              </div>
              Gérez vos adresses
            </a>
          </Link>
          <Link href='/bases-locales/charte'>
            <a>
              <div className='circle'>
                <FileText size={38} />
              </div>
              Consulter la charte
            </a>
          </Link>
          <Link href='/bases-locales'>
            <a>
              <div className='circle'>
                <Database size={38} />
              </div>
              Découvrir les bases locales
            </a>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .tools-wrapper {
          display: flex;
          flex-direction: column;
          padding: 2em 0;
          gap: 3em;
        }

        .tool-container {
          display: flex;
          flex-direction: column;
          font-weight: bold;
          font-size: 17px;
        }

        .tools-link {
          display: flex;
          justify-content: space-around;
          gap: 1em;
        }

        .circle {
          height: 70px;
          width: 70px;
          border-radius: 50%;
          color: ${theme.colors.white};
          background: ${theme.primary};
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 700;
          font-size: 12px;
          padding: 10px;
          gap: 5px;
          color: ${theme.darkText};
        }

        @media (max-width: ${theme.breakPoints.tablet}) {
          .tools-link {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default HomepageTools
