import PropTypes from 'prop-types'

function KeyNumberItem({value = '', unit, label = '', description, className}) {
  return (
    <>
      <div className={`key-number-item ${className || ''}`}>
        <span className='key-number' data-unit={unit}>{value}</span>
        <span className='number-label'>{label}</span>
        {description && <span className='number-description'>{description}</span>}
      </div>

      <style jsx>{`
      .key-number-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .key-number {
        font-size: 2.5em;
        font-weight: bold;
        line-height: 1em;
      }
      .key-number::after {
        content: attr(data-unit);
        font-size: 0.6em;
        padding-left: .1em;
      }
      .number-label {
        font-size: 0.8em;
        text-transform: uppercase;
        line-height: 1.5;
        padding-top: .5em;
        margin-right: 4em;
      }
      .number-description {
        font-size: 0.8em;
        line-height: 1.5;
        padding-top: .25em;
        margin-right: 4em;
        opacity: .8;
      }
    `}</style>
    </>
  )
}

export const KeyNumberItemPropTypes = {
  value: PropTypes.string.isRequired,
  unit: PropTypes.string,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
}

KeyNumberItem.propTypes = KeyNumberItemPropTypes

export default KeyNumberItem
