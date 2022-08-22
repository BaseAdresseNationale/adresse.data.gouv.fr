import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function ProgressBar({progress, height}) {
  return (
    <div className='progressbar-container'>
      <div className='bar-container'>
        <div className='progress' />
      </div>
      <div className='percent'>{`${progress}%`}</div>

      <style jsx>{`
        .progressbar-container {
          display: flex;
          align-items: center;
        }

        .bar-container {
          height: ${height}px;
          background: ${theme.colors.orange};
          border-radius: 5px;
          width: 100%;
        }

        .progress {
          height: 100%;
          width: ${progress}%;
          background-color: ${theme.primary};
          text-align: right;
          border-radius: 5px;
        }

        .percent {
          padding: 0 5px;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  height: PropTypes.number
}

ProgressBar.defaultProps = {
  height: 30
}

export default ProgressBar
