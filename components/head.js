import React from 'react'
import PropTypes from 'prop-types'

import theme from '../styles/theme'

import Container from './container'
import BetaRibbon from './beta-ribbon'

const Head = ({title, icon, beta, children}) => (
  <div>
    <div className='head'>
      <Container>
        <div className='flex'>
          <div className='row'>
            <div className='icon'>{icon}</div>
            <h1>{title}</h1>
          </div>

          {beta && (
            <BetaRibbon />
          )}
        </div>
      </Container>
    </div>

    <div className='description'>
      {children}
    </div>

    <style jsx>{`
      .head {
        background-color: ${theme.primary};
      }

      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .row {
        display: flex;
        align-items: center;
        max-width: 1400px;
        margin-top: 0;
        color: #fff;
        padding-bottom: 0.5em;
      }

      .icon {
        font-size: 56px;
      }

      h1 {
        margin-left: 1em;
        margin-top: 1em;
      }

      .description {
        text-align: center;
        padding: 2em 10%;
        padding-bottom: 0;
        font-size: 20px;
        font-style: italic;
        color: ${theme.colors.darkGrey};
      }

    `}</style>
  </div>
)

Head.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  beta: PropTypes.bool,
  children: PropTypes.element
}

Head.defaultProps = {
  beta: false,
  children: null
}

export default Head
