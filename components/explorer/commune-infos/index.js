import React from 'react'
import PropTypes from 'prop-types'

import Section from '../../section'
import SearchCommune from '../search-commune'

import Commune from './commune'

class CommuneInfos extends React.Component {
  render() {
    const {data} = this.props

    return (
      <Section>
        <SearchCommune />

        <Commune {...data} />
        <style jsx>{`
            .error {
              margin: 1em 0;
            }
          `}</style>
      </Section>
    )
  }
}

CommuneInfos.propTypes = {
  data: PropTypes.object
}

CommuneInfos.defaultProps = {
  data: null
}

export default CommuneInfos
