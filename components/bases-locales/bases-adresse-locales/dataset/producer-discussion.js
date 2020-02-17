import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../../section'
import ButtonLink from '../../../button-link'

class ProducerDiscussion extends React.Component {
  static propTypes = {
    page: PropTypes.string.isRequired
  }

  render() {
    const {page} = this.props

    return (
      <Section title='Un problème à signaler ?' subtitle='Ou une question à poser ?' background='grey' >
        <div style={{textAlign: 'center', marginTop: '2em'}}>
          <ButtonLink
            href={page}
            size='large'
            isOutlined
          >
            Ouvrir une discussion avec le producteur
          </ButtonLink>
        </div>
      </Section>
    )
  }
}

export default ProducerDiscussion
