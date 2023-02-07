import React from 'react'
import PropTypes from 'prop-types'
import {Input} from '@codegouvfr/react-dsfr/Input'

const defaultMessage = {
  error: 'Erreur',
  success: 'Terminé.'
}

const SearchBar = React.forwardRef((props, ref) => {
  const {label, description, placeholder, status, message, ...otherProps} = props

  return (
    <Input
      label={label}
      hintText={description}
      iconId='fr-icon-search-line'
      state={status || 'default'}
      stateRelatedMessage={message || defaultMessage[status] || null}
      nativeInputProps={{
        ref,
        placeholder,
        ...otherProps,
      }}
    />
  )
})

SearchBar.propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  placeholder: PropTypes.string,
  status: PropTypes.oneOf(['default', 'error', 'success']),
  message: PropTypes.string,
}

SearchBar.defaultProps = {
  label: null,
  description: null,
  placeholder: '',
  status: 'default',
  message: null,
}

export default SearchBar
