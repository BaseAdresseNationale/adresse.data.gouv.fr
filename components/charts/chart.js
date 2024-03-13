import PropTypes from 'prop-types'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts'

import {defaultTheme} from './color-theme'
import AxisTickByDate from './axis-tick-by-date'
import ChartsCustomTooltip from './charts-custom-tooltip'
import ChartsCustomAxisLabel from './charts-custom-axis-label'

const renderColorfulLegendText = (value, entry) => {
  const {color} = entry
  return <span style={{color}}>{value}</span>
}

const yAxisTickFormatter = value => {
  if (Number.isNaN(value)) {
    return value
  }

  if (value >= 10_000_000) {
    return `${(value / 1_000_000).toPrecision(2)}M`
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toPrecision(1)}M`
  }

  if (value >= 100_000) {
    return `${(value / 1000).toPrecision(3)}K`
  }

  if (value >= 10_000) {
    return `${(value / 1000).toPrecision(2)}K`
  }

  if (value >= 1_000) {
    return `${(value / 1000).toPrecision(1)}K`
  }

  return value
}

const typeComponents = {
  area: {
    chart: AreaChart,
    axis: Area,
  },
  bar: {
    chart: BarChart,
    axis: Bar,
  },
  line: {
    chart: LineChart,
    axis: Line,
  },
  scatter: {
    chart: ScatterChart,
    axis: Scatter,
  },
}

const defaultArea = {
  type: 'monotone',
  dataKey: 'download BAL',
  stackId: '1',
  strokeWidth: 0.5,
}

function CartesianChart({type, data, axisDef, totalKeyName: totalKeyNameProps}) {
  const dataList = Object.entries(axisDef).map(([dataKey, areaItem], index) => ({
    ...defaultArea,
    dataKey,
    stroke: dataKey?.stroke || defaultTheme[index]?.[0],
    fill: dataKey?.fill || defaultTheme[index]?.[1],
    ...(areaItem || {}),
  }))
  const totalKeyName = totalKeyNameProps || Object.values(axisDef).find(({ordinate}) => ordinate)?.dataKey
  const yAxisMaxKeyName = dataList.find(({ordinate}) => Boolean(ordinate))?.dataKey
  const yAxisMaxValue = yAxisMaxKeyName ?
    (data || []).reduce( // eslint-disable-line unicorn/no-array-reduce
      (acc, item) => {
        return Math.max(acc, item?.[yAxisMaxKeyName] ? Number(item[yAxisMaxKeyName]) : 0)
      }, 0) :
    'auto'

  const {chart: Chart, axis: Axis} = typeComponents[type]

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <Chart
        data={data}
        outerRadius={90}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 50
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='period'
          angle={-45}
          padding={{
            left: 0,
            right: 0
          }}
          tick={<AxisTickByDate />}
        />
        <YAxis
          dataKey={yAxisMaxKeyName}
          tickFormatter={yAxisTickFormatter}
          domain={[0, yAxisMaxValue === 'auto' ? yAxisMaxValue : `dataMax + ${'1'.padEnd((yAxisMaxValue).toString().length - 1, '0')}`]}
        />

        <Tooltip content={<ChartsCustomTooltip />} />

        <>
          {dataList.map((areaItem, index, arr) => (
            <Axis
              key={areaItem.dataKey}
              {...(areaItem || {})}
            >
              {totalKeyName && index === arr.length - 1 && <LabelList dataKey={totalKeyName} position='top' content={<ChartsCustomAxisLabel />} />}
            </Axis>
          ))}
        </>

        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='left'
          wrapperStyle={{
            position: 'absolute',
            paddingBottom: '20px',
            paddingTop: '50px',
          }}
          iconType='circle'
          formatter={renderColorfulLegendText}
        />
      </Chart>

    </ResponsiveContainer>
  )
}

CartesianChart.propTypes = {
  type: PropTypes.oneOf(['area', 'bar', 'line', 'scatter']),
  data: PropTypes.array,
  axisDef: PropTypes.object,
  totalKeyName: PropTypes.string,
}

export default CartesianChart
