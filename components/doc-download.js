import PropTypes from 'prop-types'
import Image from 'next/legacy/image'
import {DownloadCloud} from 'react-feather'

import theme from '@/styles/theme'

function DocDownload({title, subtitle, link, label, src, isReverse, version, children}) {
  return (
    <div className='doc-container'>
      <div className='text-container'>
        {title && <h3>{title}</h3>}
        {subtitle && <h4>{subtitle}</h4>}
        {children}
      </div>
      <div className='doc-download-container'>
        <div className='doc-infos-container'>
          <div className='preview'>
            <Image width={200} height={280} layout='fixed' src={src} alt='' aria-hidden='true' />
          </div>
          {version && <div className='version'>Version {version}</div>}
        </div>
        <a href={link} className='download-url'>
          <DownloadCloud style={{verticalAlign: 'bottom', marginRight: '5px'}} alt='' aria-hidden='true' />
          {label}
        </a>
      </div>

      <style jsx>{`
        .doc-container {
          display: flex;
          flex-wrap: wrap;
          flex-direction: ${isReverse ? 'row-reverse' : 'row'};
          margin: 1em 0;
        }

        h3 + h4 {
          margin: -20px 0px 0 0;
          font-size: small;
          color: ${theme.colors.darkGrey};
        }

        .text-container {
          flex: 2;
          margin: auto;
          min-width: 250px;
        }

        .doc-download-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .preview {
          display: flex;
          border: 5px solid ${theme.colors.whiteBlue};
          border-radius: ${theme.borderRadius};
        }

        .doc-infos-container {
          text-align: center;
          margin: 1em;
        }

        .version {
          font-style: italic;
          font-weight: bold;
          font-size: .9em;
        }

        .download-url {
          text-align: center;
        }
      `}</style>
    </div>
  )
}

DocDownload.propTypes = {
  isReverse: PropTypes.bool,
  children: PropTypes.node,
  link: PropTypes.string,
  label: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  src: PropTypes.string,
  version: PropTypes.string
}

DocDownload.defaultProps = {
  isReverse: false,
  children: null,
  link: null,
  label: null,
  title: null,
  subtitle: null,
  src: null,
  version: null
}

export default DocDownload
