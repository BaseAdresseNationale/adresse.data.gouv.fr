import PropTypes from 'prop-types'
import Image from 'next/image'
import {DownloadCloud} from 'react-feather'

import theme from '@/styles/theme'

function DocDownload({title, link, label, src, isReverse, version, children}) {
  return (
    <div className='doc-container'>
      <div className='text-container'>
        <h3>{title}</h3>
        {children}
      </div>
      <div className='doc-download-container'>
        <div className='doc-infos-container'>
          <div className='preview'>
            <Image width={200} height={280} layout='fixed' src={src} alt='' />
          </div>
          {version && <div className='version'>Version {version}</div>}
        </div>
        <a href={link} className='download-url'>
          <DownloadCloud style={{verticalAlign: 'bottom', marginRight: '5px'}} alt='' />
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
  src: PropTypes.string,
  version: PropTypes.string
}

DocDownload.defaultProps = {
  isReverse: false,
  children: null,
  link: null,
  label: null,
  title: null,
  src: null,
  version: null
}

export default DocDownload
