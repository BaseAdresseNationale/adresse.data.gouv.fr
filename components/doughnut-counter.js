import PropTypes from 'prop-types'
import {Doughnut} from 'react-chartjs-2'
import {Chart as ChartJS, ArcElement} from 'chart.js'

ChartJS.register(ArcElement)

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
          max-height: 300px;
          display: flex;
          flex-direction: column;
          padding: .5em;
          border: 1px solid lightgrey;
          border-radius: 5px;
          gap: 10px;
        }

        .title {
          font-size: 1.2em;
          font-weight: bold;
        }

        .value-up {
          font-size: 1.3em;
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
