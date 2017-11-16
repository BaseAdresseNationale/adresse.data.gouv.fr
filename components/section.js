import PropTypes from 'prop-types'

import theme from '../styles/theme'

import Container from './container'

const Section = ({title, subtitle, children, background, centered}) => (
  <section className={`section-${background}`}>
    <Container>
      {title && <h2 className='title'>{title}</h2>}
      {subtitle && <p className='subtitle'>{subtitle}</p>}

      {children}
    </Container>

    <style jsx>{`
      section {
        padding: 3em 0;
        ${centered && 'text-align: center;'}
      }

      .section-white {
        background-color: ${theme.backgroundWhite};
        color: ${theme.colors.black};
      }

      .section-grey {
        background-color: ${theme.backgroundGrey};
        color: ${theme.colors.black};
      }

      .section-dark {
        background-color: ${theme.backgroundDark};
        color: ${theme.colors.white};
      }

      .section-color {
        background-color: ${theme.backgroundColor};
        color: ${theme.colors.white};
      }

      h2 {
        margin: 0 0 2.2em;
        text-align: center;
      }

      p {
        margin: 0 auto 2em;
        max-width: 640px;
        font-size: 1.3em;
        font-weight: normal;
        font-style: italic;
        text-align: center;
      }

      .section-white p {
        color: ${theme.secondary};
      }

      h2 + p {
        margin-top: -2em;
        margin-bottom: 0.2em;
        padding-bottom: 2em;
      }
    `}</style>
  </section>
)

Section.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  background: PropTypes.oneOf([
    'white',
    'grey',
    'dark',
    'color'
  ]),
  centered: PropTypes.bool
}

Section.defaultProps = {
  title: null,
  subtitle: null,
  children: null,
  background: 'white',
  centered: false
}

export default Section
