import Link from 'next/link'

import theme from '@/styles/theme'

import BanSearch from '@/components/ban-search'
import {Database, FileText, MapPin} from 'react-feather'

function HomepageTools() {
  return (
    <div className='tools-wrapper'>
      <div className='tool-container'>
        <p>Rechercher les adresses d’une commune</p>
        <BanSearch />
      </div>

      <div className='separator' />

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
          padding: 2em 0;
          gap: 3em;
        }

        .tool-container {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          flex: 1em;
          gap: 2em;
        }

         .separator {
           width: 3px;
           background: ${theme.primary};
         }

        .tools-link {
          display: flex;
          justify-content: space-between;
          gap: 2em;
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
          font-size: 0.6em;
          color: ${theme.darkText};
        }

        @media (max-width: ${theme.breakPoints.desktop}) {
          .separator {
            display: none;
          }

          .tools-wrapper {
            flex-direction: column;
          }
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
