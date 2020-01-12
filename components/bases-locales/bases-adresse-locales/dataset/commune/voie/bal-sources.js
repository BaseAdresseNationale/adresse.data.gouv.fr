import React from 'react'
import PropTypes from 'prop-types'

const BalSources = ({sources}) => {
  const types = sources => {
    const typesArray = sources.map(source => source)
    return typesArray.filter((item, index, inputArray) => {
      return inputArray.indexOf(item) === index
    })
  }

  return (
    <>
      {sources.length === 0 ? null : types(sources).toString()}
    </>
  )
}

BalSources.propTypes = {
  sources: PropTypes.array.isRequired
}

export default BalSources
