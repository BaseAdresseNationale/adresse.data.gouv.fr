import PropTypes from 'prop-types'
import {Doughnut} from 'react-chartjs-2'

import theme from '@/styles/theme'

function DoughnutCounter({title, valueUp, valueDown, data, options}) {
  return (
    <div className='stat'>
      <div className='title'>{title}</div>
      <div className='value-up'>{valueUp}</div>
      <div className='donut'>
        <Doughnut data={data} options={options} />
      </div>
      <div className='value-down'>{valueDown}</div>

      <style jsx>{`
        .donut {
          max-width: 35%;
          margin: auto;
        }

        .stat {
          display: grid;
          grid-template-rows: 24px 45px 1fr 70px;
          margin: 1em;
          padding: 1em;
          border: 1px solid lightgrey;
          border-radius: 5px;
          margin-top: 0.5em;
          gap: 1em;
        }

        .title {
          font-size: 1.2em;
          font-weight: bold;
        }

        .value-up {
          font-size: 1.5em;
          padding: .5em;
        }

        .value-down {
          padding: .5em 0;
          align-self: flex-start;
        }


      `}</style>
    </div>
  )
}

DoughnutCounter.defaultProps = {
  title: '',
  valueUp: '',
  valueDown: ''
}

DoughnutCounter.propTypes = {
  title: PropTypes.string,
  valueUp: PropTypes.string,
  valueDown: PropTypes.string,
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
}

export default DoughnutCounter
