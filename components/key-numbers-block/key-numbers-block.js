import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import KeyNumberItem, {KeyNumberItemPropTypes} from './key-number-item'

function KeyNumbersBlock({data = [], className, hasSeparator}) {
  return (
    <>
      <div className={`key-numbers ${hasSeparator ? 'has-separator' : ''} ${className}`}>
        {data.map(
          ({large, hasSeparator, className = '', ...keyNumberProps}) => (
            <KeyNumberItem
              key={keyNumberProps.label}
              className={`${className} ${large ? 'large' : ''} ${hasSeparator ? 'has-separator' : ''}`.trim()}
              {...keyNumberProps}
            />
          ))}
      </div>

      <style jsx>{`
        .key-numbers {
          display: grid;
          grid-template-columns: repeat(2, minmax(150px, 1fr));
          gap: 2em;
          margin: 4em 0;
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .key-numbers {
            display: flex;
            flex-direction: column;
            gap: 3.5em;
            flex-direction: row;
          }
        }
        .key-numbers > :global(*.large) {
          grid-column: 1 / span 2;
          padding: 0 0 1.5em;
        }
        .key-numbers > :global(*) {
          position: relative;
          flex: 1;
        }
        .key-numbers > :global(*)::before {
            width: 1px;
            background-color: currentColor;
            display: block;
            position: absolute;
            opacity: 0.3;
            top: 1.5em;
            bottom: 0.5em;
        }
        .key-numbers > :global(*.has-separator)::before,
        .key-numbers.has-separator > :global(*):not(.large):nth-child(2n)::before {
          content: '';
          left: -1.5em;
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .key-numbers > :global(*):not(:first-child)::before {
            content: '';
            left: -1.75em;
          }
        }

    `}</style>
    </>
  )
}

KeyNumbersBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    ...KeyNumberItemPropTypes,
    large: PropTypes.bool,
    hasSeparator: PropTypes.bool,
  })),
  className: PropTypes.string,
  hasSeparator: PropTypes.bool,
}

export default KeyNumbersBlock
