import React from 'react'
import PropTypes from 'prop-types'

import Container from './container'

const Section = ({title, subtitle, children, background}) => (
  <section className={`section section-${background}`}>
    <Container>
      {title && <h2 className='section__title'>{title}</h2>}
      {subtitle && <p className='section__subtitle'>{subtitle}</p>}
      {children}
    </Container>
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
  ])
}

Section.defaultProps = {
  title: null,
  subtitle: null,
  children: null,
  background: 'white'
}

export default Section
