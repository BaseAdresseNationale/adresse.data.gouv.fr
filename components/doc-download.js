import React from 'react'
import PropTypes from 'prop-types'
import {Book} from 'react-feather'

import theme from '../styles/theme'

const DocDownload = ({children, isReverse, imgSrc, link, title, imgAlt}) => (
  <div className='doc-container'>
    <div className='text-container'>
      <h3>{title}</h3>
      {children}
    </div>
    <div className='img-container'>
      <img src={imgSrc} alt={imgAlt} />
      <a href={link}>
        <Book style={{verticalAlign: 'bottom', marginRight: '5px'}} />
        Télécharger
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

        .img-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .img-container img {
          margin: 1em;
          width: 200px;
          border: 1px solid ${theme.border};
        }
      `}</style>
  </div>
)

DocDownload.propTypes = {
  isReverse: PropTypes.bool,
  children: PropTypes.node,
  link: PropTypes.string,
  title: PropTypes.string,
  imgSrc: PropTypes.string,
  imgAlt: PropTypes.string
}

DocDownload.defaultProps = {
  isReverse: false,
  children: null,
  link: null,
  title: null,
  imgSrc: null,
  imgAlt: null
}

export default DocDownload

