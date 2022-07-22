import theme from '@/styles/theme'
import PropTypes from 'prop-types'
import {DownloadCloud} from 'react-feather'

function DownloadCard({format, url, isAvailable, color}) {
  return (
    <div className='card-container'>
      <div className='format'>Format {format}</div>
      <div className={`download-container ${color}`}>
        <a className='download-link' href={url}><DownloadCloud alt />Télécharger</a>
      </div>

      <style jsx>{`
        .card-container {
          display: grid;
          grid-template-rows: 1fr 70px;
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
          padding: 1em;
          font-size: 18px;
          font-weight: bold;
          color: ${theme.darkText};
          background: ${theme.colors.white};
          border-radius: 5px 5px 0 0;
          text-align: center;
          align-items: center;
          display: flex;
          justify-content: center;
        }

        .download-container {
          border-radius: 0 0 5px 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .download-link {
          pointer-events: ${isAvailable ? 'auto' : 'none'};
          color: ${theme.colors.white};
          display: flex;
          justify-content: center;
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
  isAvailable: PropTypes.bool,
  color: PropTypes.oneOf([
    'primary',
    'secondary'
  ])
}

DownloadCard.defaultType = {
  color: 'primary',
  isAvailable: true
}

export default DownloadCard
