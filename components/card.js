import PropTypes from 'prop-types'
import theme from '@/styles/theme'
import {DownloadCloud} from 'react-feather'

function Card({title, children, href, action, list, links}) {
  return (
    <div className='card-container'>
      <div className='title'>{title}</div>
      <div className='card-content'>
        {children}

        {(list || links) && (
          <>
            {list && (
              <ul>
                {list.map(item => <li key={item}>{item}</li>)}
              </ul>
            )}

            {links && (
              <ul>
                {links.map(link => <li key={link.title}><a href={link.href}>{link.title}</a></li>)}
              </ul>
            )}
          </>
        )}
      </div>

      {href ? (
        <a className='download-link' href={href}>
          <DownloadCloud style={{verticalAlign: 'bottom', marginRight: '10px'}} />
          {action}
        </a>
      ) : (
        <div className='no-link'>
          Bientôt disponible
        </div>
      )}

      <style jsx>{`
        .card-container {
          padding: 1.5em;
          margin: 1em;
          background-color: white;
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .title {
          font-weight: 700;
          margin-top: 1em;
          border-bottom: solid 3px ${theme.primary};
          padding-bottom: 10px;
          text-align: center;
          font-size: 18px;
        }

        .card-content {
          flex: 1;
          text-align: start;
        }

        .download-link {
          font-weight: bold;
          background-color: ${theme.primary};
          color: white;
          padding: .8em;
          font-size: 1.2em;
          text-decoration: none;
          text-align: center;
        }

        .download-link:hover {
          text-decoration: underline;
          cursor: pointer;
        }

        .no-link {
          font-weight: bold;
          background-color: ${theme.boxShadow};
          color: white;
          padding: .8em;
          font-size: 1.2em;
          text-decoration: none;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Card.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.string,
  list: PropTypes.array,
  links: PropTypes.array
}

Card.defaultProps = {
  title: null,
  href: null,
  children: null,
  action: 'Télécharger',
  list: null,
  links: null,
}

export default Card
