import React from 'react'
import PropTypes from 'prop-types'
import theme from '../styles/theme'

const Card = ({title, children, link, action}) => (
  <div className='card-container'>
    <div className='title'>{title}</div>
    <div className='text-container'>
      {children}
    </div>
    {link ? (
      <a className='download-link' href={link}>
        {action}
      </a>
    ) : (
      <div className='no-link'>
        Bientôt disponible
      </div>
    )}
    <style jsx>{`
      .card-container {
        margin: 1em;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: white;
        text-align: center;
      }
      .title {
        font-weight: 600;
        margin-top: 1em;
      }
      .text-container {
        flex: 1;
      }
      .download-link {
        font-weight: bold;
        background-color: ${theme.primary};
        color: white;
        padding: .8em;
        font-size: 1.2em;
        text-decoration: none;
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
      @media screen and (max-width: 992px) {
        .other {
          width: 100%;
          margin: .5em auto;
        }
    `}</style>
  </div>
)

Card.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.string
}

Card.defaultProps = {
  title: null,
  link: null,
  children: null,
  action: 'Télécharger'
}

export default Card
