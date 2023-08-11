import PropTypes from 'prop-types'

function SelectInput({label, value, hint, options, defaultOption, isDisabled, handleChange, isMultiple}) {
  return (
    <div className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}>
      <label className='fr-label' htmlFor={`select-${label}`}>
        {label}
        {hint && <span className='fr-hint-text'>{hint}</span>}
      </label>

      <select
        className='fr-select'
        style={{width: '100%'}}
        id={`select-${label}`}
        name={`select-${label}`}
        value={value}
        disabled={isDisabled}
        onChange={event => {
          handleChange(event.target.value)
        }}
        multiple={isMultiple}
      >
        {defaultOption && <option value=''>{defaultOption}</option>}
        {options.map(option => (
          <option
            key={option.label}
            value={option.value}
            disabled={isDisabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  hint: PropTypes.string,
  options: PropTypes.array.isRequired,
  defaultOption: PropTypes.string,
  isDisabled: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
}

export default SelectInput

