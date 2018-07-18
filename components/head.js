import React from 'react'
import PropTypes from 'prop-types'

import theme from '../styles/theme'

import Container from './container'

const Head = ({children, title, icon}) => (
  <div className='head'>
    <Container>
      <div className='row'>
        <div className='icon'>{icon}</div>
        <div className='text'>
          <h1>{title}</h1>
          <div className='description'>
            {children}
          </div>
        </div>
      </div>
    </Container>
    <style jsx>{`
      .head {
        background-color: ${theme.backgroundColor};
      }

      .row {
        display: flex;
        align-items: center;
        max-width: 1400px;
        margin-top: 0;
        color: ${theme.colors.white};
        padding: 40px;
      }

      .icon {
        font-size: 56px;
      }

      .text {
        padding-left: 40px;
      }

      .description {
        margin: 0 auto 2em;
        max-width: 640px;
        font-size: 1.1em;
        font-style: italic;
        margin-bottom: 0;
      }

      @media (max-width: 480px) {
        .row {
          flex-direction: column;
          padding: 40px 20px;
        }

        .text {
          padding-left: 0;
        }
      }
      `}</style>
  </div>
)

Head.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired
}

Head.defaultProps = {
  children: null
}

export default Head
