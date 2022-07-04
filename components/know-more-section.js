import PropTypes from 'prop-types'
import {ExternalLink, FileText} from 'react-feather'

import theme from '@/styles/theme'

function KnowMoreSection({links}) {
  return (
    <div className='discover-more'>
      <h3>En savoir plus</h3>
      <ul className='discover-links'>
        {
          links.map(({isFile, href, title}) => {
            return (
              <li key={href}>
                {isFile ? <FileText alt /> : <ExternalLink alt />}<a href={href}>{title}</a>
              </li>
            )
          })
        }
      </ul>

      <style jsx>{`
        .discover-more {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2em;
        }

        h3 {
          text-align: center;
          margin: 0;
        }

        .discover-links {
          list-style-type: none;
          padding: 0;
          width: fit-content;
        }

        .discover-links li {
          margin: 10px 0;
          display: grid;
          grid-template-columns: 20px 1fr;
          justify-items: left;
          gap: 10px;
          color: ${theme.primary};
        }
      `}</style>
    </div>
  )
}

KnowMoreSection.propTypes = {
  links: PropTypes.array.isRequired
}

export default KnowMoreSection
