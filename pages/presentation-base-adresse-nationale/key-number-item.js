// Import css from 'styled-jsx/css'
import PropTypes from 'prop-types'

function KeyNumberItem({number, label, description, unity}) {
  return (
    <>
      <div className='key-number-item'>
        <span className='key-number' data-unity={unity}>{number}</span>
        <span className='number-label'>{label}</span>
        {description && <span className='number-description'>{description}</span>}
      </div>

      <style jsx>{`
      .key-number-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        position: relative;
      }

      .key-number {
        font-size: 2.5em;
        font-weight: bold;
        line-height: 1em;
      }
      .key-number::after {
        content: attr(data-unity);
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

KeyNumberItem.propTypes = {
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  unity: PropTypes.string,
}

export default KeyNumberItem
