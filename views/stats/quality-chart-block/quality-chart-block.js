import PropTypes from 'prop-types'
import {numFormater} from '@/lib/format-numbers'
import theme from '@/styles/theme'

import QualityPieCharts from './quality-pie-charts'
import StarLine from '@/components/star-line'
import ColorLine from '@/components/color-line'

function QualityChartBlock({data, chartSize = 200}) {
  return (
    <>
      <div className='quality-wrapper'>
        <div className='quality-chart-wrapper'>
          <QualityPieCharts data={data} size={chartSize} />
        </div>

        <div>
          <div>
            {data[1].map(({name, value, color, description}) => (
              <div className='quality-starline-container' key={name}>
                <span className='quality-starline-wrapper' style={{color}}>
                  <b className='quality-starline-wrapper-percent'>&nbsp;{numFormater(value)}%&nbsp;</b>
                  <StarLine score={Number.parseFloat(name)} color={color} className='quality-starline-wrapper-starline' />
                </span><i className='quality-starline-wrapper-description'>{description}</i>
              </div>
            ))}
          </div>

          <hr />

          <div>
            {data[0].map(({name, value, color, description}) => (
              <div className='quality-starline-container' key={name}>
                <span className='quality-starline-wrapper' style={{color}}>
                  <b className='quality-starline-wrapper-percent'>&nbsp;{numFormater(value)}%&nbsp;</b>
                  <ColorLine color={color} className='quality-starline-wrapper-starline' />
                </span><i className='quality-starline-wrapper-description'>{description}</i>
              </div>
            ))}

          </div>
        </div>

      </div>

      <style jsx>{`
        .quality-wrapper {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1em;
          margin: 5em 0;
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .quality-wrapper {
            flex-direction: row;
          }
        }
        .quality-starline-container {
          margin: 0 0 1em;
        }
        .quality-starline-wrapper {
          display: flex;
          justify-content: flex-end;
          flex-direction: row-reverse;
          align-items: center;
          gap: 0.5em;
          margin-left: -0.25em;
        }
        .quality-starline-wrapper::after {
          display: inline-block;
          color: #000000;
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .quality-starline-container {
            margin: 0;
          }
          .quality-starline-wrapper {
            display: inline-flex;
            justify-content: flex-start;
            flex-direction: row;
            margin-left: 0;
          }
          .quality-starline-wrapper::after {
            content: '-';
            padding: 0 0.55em 0 0;
            margin-left: -0.25em;
          }
        }

        .quality-starline-wrapper-percent {
          width: 3em;
          text-align: right;
        }
        .quality-chart-wrapper {
          width: ${chartSize}px;
          height: ${chartSize}px;
          margin: 0 0 2.5em;
        }
        @media (min-width: ${theme.breakPoints.desktop}) {
          .quality-chart-wrapper {
            margin-bottom: 0;
            min-width: ${chartSize}px;

          }
        }
      `}</style>
    </>
  )
}

QualityChartBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }))).isRequired,
  chartSize: PropTypes.number,
}

export default QualityChartBlock
