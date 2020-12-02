import React from 'react'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Container from './container'
import BetaRibbon from './beta-ribbon'

function Head({title, icon, isBeta}) {
  return (
    <div>
      <div className='head'>
        <Container>
          <div className='flex'>
            <div className='title'>
              <div className='icon'>{icon}</div>
              <h1>{title}</h1>
            </div>

            {isBeta && (
              <BetaRibbon />
            )}
          </div>
        </Container>
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

      .title {
        display: flex;
        align-items: center;
        max-width: 1400px;
        margin-top: 0;
        color: #fff;
        padding-bottom: 0.5em;
      }

      .icon {
        font-size: 50px;
      }

      h1 {
        margin-left: 1em;
        margin-top: 1em;
      }
    `}</style>
    </div>
  )
}

Head.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  isBeta: PropTypes.bool
}

Head.defaultProps = {
  isBeta: false
}

export default Head
