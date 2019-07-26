import React from 'react'
import PropTypes from 'prop-types'
import FaAngleLeft from 'react-icons/lib/fa/angle-left'

const Back = ({handleClick}) => (
  <>
    <div className='back' onClick={handleClick}>
      <FaAngleLeft size={26} /> Départements
    </div>

    <style jsx>{`
      .back {
        display: flex;
        align-items: center;
      }

      .back:hover {
        cursor: pointer;
      }
    `}</style>
  </>
)

Back.propTypes = {
  handleClick: PropTypes.func.isRequired
}

export default Back
