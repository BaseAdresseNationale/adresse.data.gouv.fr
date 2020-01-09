import React from 'react'
import PropTypes from 'prop-types'
import {ChevronLeft} from 'react-feather'

const Back = ({handleClick}) => (
  <>
    <div className='back' onClick={handleClick}>
      <ChevronLeft size={26} /> Départements
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
