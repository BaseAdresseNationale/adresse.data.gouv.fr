import PropTypes from 'prop-types'

import theme from '../styles/theme'

import Container from './container'

const Head = ({children, title, icon}) => (
  <div className='head'>
    <Container>
      <div className='row'>
        <h1>{title}</h1>
        {children}
      </div>
    </Container>
    <style jsx>{`
      .head {
        background-color: ${theme.backgroundDark};
      }
      .row {
        background-image: url(${icon});
        max-width: 1400px;
        margin-top: 0;
        color: ${theme.colors.white};
        padding: 40px;
        padding-left: 140px;
        background-repeat: no-repeat;
        background-position: center left 20px;
      }
      `}</style>
  </div>
)

Head.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
}

export default Head
