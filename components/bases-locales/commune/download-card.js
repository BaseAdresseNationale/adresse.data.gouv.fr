import theme from '@/styles/theme'
import PropTypes from 'prop-types'
import {DownloadCloud} from 'react-feather'

function DownloadCard({format, url, isAvailable, color}) {
  return (
    <div className='card-container'>
      <div className='format'>Format {format}</div>
      <div className={`download-container ${color}`}>
        <a className='download-link' href={url}><DownloadCloud />Télécharger</a>
      </div>

      <style jsx>{`
        .card-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: fit-content;
          font-size: 22px;
          opacity: ${isAvailable ? '1' : '0.5'}
        }

        .primary {
          background: ${theme.primary};
        }

        .secondary {
          background: ${theme.colors.almostBlack};
        }

        .format {
          width: 100%;
          padding: 1em 4em;
          font-size: 24px;
          font-weight: bold;
          color: ${theme.darkText};
          background: ${theme.colors.white};
          border-radius: 5px 5px 0 0;
        }

        .download-container {
          width: 100%;
          padding: 1em 4em;
          border-radius: 0 0 5px 5px;
        }

        .download-link {
          pointer-events: ${isAvailable ? 'auto' : 'none'};
          color: ${theme.colors.white};
          display: flex;
          gap: .5em;
        }

        .download-link:hover {
          background: transparent;
        }
      `}</style>
    </div>
  )
}

DownloadCard.propTypes = {
  format: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  isAvailable: PropTypes.bool.isRequired,
  color: PropTypes.oneOf([
    'primary',
    'secondary'
  ])
}

DownloadCard.defaultType = {
  color: 'primary'
}

export default DownloadCard
