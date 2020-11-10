import React from 'react'
import PropTypes from 'prop-types'
import {Book} from 'react-feather'

const DocDownload = ({children, isReverse, imgSrc, link, title, imgAlt}) => (
  <div className='align'>
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
        .align {
          display: flex;
          flex-wrap: wrap;
          flex-direction: ${isReverse ? 'row-reverse' : 'row'}
        }
        .text-container {
          flex: 2;
          margin: auto;
          min-width: 250px;
        }
        .img-container {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
        }
        .img-container img {
          max-width: 200px;
          height: auto;
          width: 100%;
          margin: 1em auto;
          border: 1px solid #ADB9C9;
        }
        .img-container a {
          margin: auto;
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

