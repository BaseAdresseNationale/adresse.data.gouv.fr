import PropTypes from 'prop-types'
import {uniqueId} from 'lodash'

import theme from '@/styles/theme'

function BodyListFantoir({contents, onSelect, isCanceled}) {
  return (
    <div>
      <button type='button' aria-label={`Accéder aux données de ${contents[0]}`} onClick={onSelect}>
        <div className={isCanceled ? 'line canceled' : 'line'}>
          {contents.map(item => (
            <div key={uniqueId('_infos')} className='infos'>{item}</div>
          ))}
        </div>
      </button>

      <style jsx>{`
        button {
          width: 100%;
          border: none;
          background: none;
          font-size: 14px;
        }

        .line {
          display: flex;
          padding: .5em;
          border-bottom: 1px solid ${theme.border};
          border-left: 1px solid ${theme.border};
          border-right: 1px solid ${theme.border};
          border-top: 1px solid rgba(0, 0, 0, 0);
        }

        .line:hover {
          cursor: pointer;
          color: #000;
          background-color: ${theme.colors.lighterGrey};
        }

        .infos {
          flex: 1;
          text-align: center;
        }

        .canceled {
          color: #000;
          background-color: ${theme.errorBg};
        }
      `}</style>
    </div>
  )
}

BodyListFantoir.defaultProps = {
  isCanceled: false
}

BodyListFantoir.propTypes = {
  contents: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  isCanceled: PropTypes.bool
}

export default BodyListFantoir
