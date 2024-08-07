interface SelectInputProps {
  label: string
  value: string
  hint?: string
  options: { label: string, value: string }[]
  defaultOption?: string
  isDisabled?: boolean
  handleChange: (value: string) => void
  isMultiple?: boolean
}

function SelectInput({ label, value, hint, options, defaultOption, isDisabled, handleChange, isMultiple }: SelectInputProps) {
  return (
    <div className={`fr-select-group ${isDisabled ? 'fr-select-group--disabled' : ''}`}>
      <label className="fr-label" htmlFor={`select-${label}`}>
        {label}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </label>

      <select
        className="fr-select"
        style={{ width: '100%' }}
        id={`select-${label}`}
        name={`select-${label}`}
        value={value}
        disabled={isDisabled}
        onChange={(event) => {
          handleChange(event.target.value)
        }}
        multiple={isMultiple}
      >
        {defaultOption && <option value="">{defaultOption}</option>}
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

export default SelectInput
