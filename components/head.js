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
          <p className='description'>{children}</p>
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
      `}</style>
  </div>
)

Head.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired
}

export default Head
