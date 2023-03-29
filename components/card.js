import PropTypes from 'prop-types'
import theme from '@/styles/theme'
import {DownloadCloud} from 'react-feather'

function Card({title, link, action, links, list, children, color}) {
  return (
    <div className='card-container'>
      <div className='title'>{title}</div>
      <div className='text-container'>
        <div className='card-description'>
          {children}
        </div>

        {(links || list) && (
          <div>
            {list && (
              <ul className='card-list'>
                {list.map(item => <li key={item}>{item}</li>)}
              </ul>
            )}

            {links && (
              <div className='card-links'>
                {links.map(({title, href}) => <a key={title} href={href} aria-label={`Accéder au contenu ${title}`}>{title}</a>)}
              </div>
            )}
          </div>
        )}
      </div>

      {link ? (
        <a className='download-link' href={link}>
          <DownloadCloud style={{verticalAlign: 'bottom', marginRight: '4px'}} alt='' aria-hidden='true' /> {action}
        </a>
      ) : (
        <div className='no-link'>
          Bientôt disponible
        </div>
      )}

      <style jsx>{`
        .card-container {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background-color: ${theme.colors.white};
          text-align: center;
          border-radius: 5px;
          margin-top: 1em;
        }

        .title {
          font-weight: 700;
          color: ${theme.darkText};
          padding: 1em;
        }

        .text-container {
          flex: 1;
          height: 120px;
          padding: 1em;
          display: grid;
          grid-template-rows: ${(links || list) ? '1fr 100px' : '1fr'};
          gap: 1.5em;
          text-align: left;
        }

        .card-description {
          text-align: center;
        }

        .card-list {
          font-weight: bold;
          padding-bottom: .4em;
        }

        .card-links {
          text-align: center;
        }

        .download-link, .no-link {
          font-weight: bold;
          background-color: ${color === 'primary' ? theme.primary : theme.backgroundDisable};
          color: white;
          padding: .8em;
          font-size: 1.2em;
          text-decoration: none;
          border-radius: 0 0 5px 5px;
          transition: ease .25s;
          transition-property: color, background-color;
        }

        .download-link:hover,
        .download-link:active,
        .download-link:focus,
        .download-link:visited {
          color: #fff;
        }


        .download-link:hover {
          background-color: #333;
          text-decoration: underline;
          cursor: pointer;
        }

        .no-link {
          pointer-events: none;
          background-color: ${theme.backgroundDisable};
          color: white;
        }
      `}</style>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary']),
  links: PropTypes.array,
  list: PropTypes.array,
}

Card.defaultProps = {
  link: null,
  action: 'Télécharger',
  color: 'primary',
  links: null,
  list: null,
}

export default Card
