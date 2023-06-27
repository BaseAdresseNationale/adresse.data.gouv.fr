import PropTypes from 'prop-types'
import {Check, X} from 'react-feather'

import theme from '@/styles/theme'

function TextIsValid({text, isValid}) {
  return (
    <div>
      <div className='item'>
        <div><b>{text}</b></div>
        {isValid ? <div className='check'><Check alt='Valide' /></div> : <div className='error'><X alt='Invalide' /></div>}
      </div>

      <style jsx>{`
        .item {
          display: flex;
          margin-bottom: 10px;
        }

        .check {
          margin-left: 1em;
          color: ${theme.colors.green};
        }

        .error {
          margin-left: 1em;
          color: ${theme.colors.red};
        }
        `}</style>
    </div>
  )
}

TextIsValid.propTypes = {
  text: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired
}

export default TextIsValid
