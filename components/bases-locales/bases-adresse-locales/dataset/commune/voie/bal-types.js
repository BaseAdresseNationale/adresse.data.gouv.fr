import React from 'react'
import PropTypes from 'prop-types'

const BalTypes = ({positions}) => {
  const checkTypes = Object.prototype.hasOwnProperty.call(positions[0], 'type')

  const types = positions => {
    const typesArray = positions.map(position => position.type)
    return typesArray.filter((item, index, inputArray) => {
      return inputArray.indexOf(item) === index
    })
  }

  return (
    <>
      {checkTypes ? types(positions).toString() : null}
    </>
  )
}

BalTypes.propTypes = {
  positions: PropTypes.array.isRequired
}

export default BalTypes
