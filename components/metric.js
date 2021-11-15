import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function Metric({metric, children, isPercent}) {
  return (
    <div className='metric-container'>
      <div className='metric'>{metric}{isPercent ? '%' : ''}</div>
      <div className='title'>{children}</div>

      <style jsx>{`
        .metric-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-self: center;
        }

        .metric {
          font-size: 30px;
          font-weight: bold;
          color: ${theme.primary};
        }

        .title {
          font-size: 18px;
        }
      `}</style>
    </div>
  )
}

Metric.propTypes = {
  metric: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  children: PropTypes.node,
  isPercent: PropTypes.bool
}

Metric.defaultProps = {
  children: null,
  isPercent: false
}
export default Metric
