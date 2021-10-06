import {useState} from 'react'
import PropTypes from 'prop-types'
import {ChevronUp, ChevronDown} from 'react-feather'

function PostalCodes({codes}) {
  const [showCodes, setShowCodes] = useState(false)
  return (
    <div className='postal-codes-container'>
      {codes.length === 1 ? (
        <div>
          Code postal : <b>{codes[0]}</b>
        </div>
      ) : (
        <div className='postal-codes'>
          <div>
            <div className='with-icon wrapper' onClick={() => setShowCodes(!showCodes)}>
              <div>Codes postaux</div> {showCodes ? <ChevronUp /> : <ChevronDown />}
            </div>
          </div>
          {showCodes && (
            <ul className='codes-list'>
              {codes.map(code => <li key={code}>{code}</li>)}
            </ul>
          )}
        </div>
      )}

      <style jsx>{`
        .postal-codes-container {
          position: relative;
        }

        .postal-codes {
          cursor: pointer;
        }

        .with-icon {
          display: flex;
        }

        .wrapper {
          justify-content: space-between;
          background: whitesmoke;
          padding: 0.2em 0.4em;
          border-radius: 4px;
        }

        .with-icon > div {
          margin-right: 0.4em;
        }

        .codes-list {
          margin: 0;
        }
      `}</style>
    </div>
  )
}

PostalCodes.propTypes = {
  codes: PropTypes.array.isRequired
}

export default PostalCodes
