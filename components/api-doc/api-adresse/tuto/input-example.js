import PropTypes from 'prop-types'
import React from 'react'

import Button from '@/components/button'

function InputExample({value, copy}) {
  const handleClick = () => {
    copy(`curl '${value}'`)
  }

  return (
    <div>
      <div className='example'>
        <input type='text' value={`curl '${value}'`} readOnly />
        <Button style={{borderRadius: '0 5px 5px 0'}} onClick={handleClick}>Copier</Button>
      </div>
      <style jsx>{`
        .example {
          display: flex;
        }

        input {
          border-radius: 5px 0 0 5px;
        }
        `}</style>
    </div>
  )
}

InputExample.propTypes = {
  value: PropTypes.string.isRequired,
  copy: PropTypes.func.isRequired
}

export default InputExample
