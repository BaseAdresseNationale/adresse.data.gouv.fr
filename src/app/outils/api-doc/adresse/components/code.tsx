import PropTypes from 'prop-types'
import colors from '../utils/color'
function Code({ code }) {
  return (
    <>
      <pre><code>{code}</code></pre>
      <style jsx>{`
        pre {
          background: ${colors.white};
          border: 1px solid ${colors.lighterGrey};
          border-radius: 5px;
          width: 100%;
          padding: 1em;
          margin: 1em 0;
        }

        code {
          color: ${colors.darkerGrey};
          white-space: pre-wrap;
        }
      `}
      </style>
    </>
  )
}

Code.propTypes = {
  code: PropTypes.string.isRequired,
}

export default Code
