import PropTypes from 'prop-types'

import theme from '@/styles/theme'

import Result from './result'
import Presentation from './presentation'

function Tuto({title, description, icon, example, results, tips, warning, side, isLoading, children}) {
  return (
    <div className='tuto-container'>

      <div className='presentation'>
        <Presentation title={title} description={description} icon={icon} tips={tips} warning={warning}>
          {children}
        </Presentation>
      </div>

      <div className='result'>
        <Result example={example} results={results} side={side} isLoading={isLoading} />
      </div>

      <style jsx>{`
        .tuto-container {
          display: flex;
          justify-content: space-around;
          flex-direction: ${side === 'right' ? 'row-reverse' : 'row'};
        }

        .result {
          width: 50%;
        }

        .presentation {
          width: 40%;
          margin-right: 1em;
        }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .tuto-container {
            flex-direction: column;
          }

          .tuto-container div {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

Tuto.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  example: PropTypes.string.isRequired,
  side: PropTypes.PropTypes.oneOf([
    'right', 'left'
  ]).isRequired,
  results: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
  tips: PropTypes.string,
  warning: PropTypes.string,
  isLoading: PropTypes.bool,
  children: PropTypes.node
}

Tuto.defaultProps = {
  tips: '',
  warning: '',
  results: null,
  isLoading: true,
  children: null
}

export default Tuto
