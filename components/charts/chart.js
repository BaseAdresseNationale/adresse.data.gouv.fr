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

const renderColorfulLegendText = (value, entry) => {
  const {color} = entry
  return <span style={{color}}>{value}</span>
}

const yAxisTickFormatter = value => {
  return Number.isNaN(value) ?
    value :
    `${value.toLocaleString(
      undefined, {minimumFractionDigits: 0}
    ).replace(/000$/g, 'K')}`
}

const defaultArea = {
  type: 'monotone',
  dataKey: 'download BAL',
  stackId: '1',
  strokeWidth: 0.5,
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

function CartesianChart({type, data, axisDef, yAxisMaxKeyName, totalKeyName}) {
  const dataList = Object.entries(axisDef).map(([dataKey, areaItem], index) => ({
    ...defaultArea,
    dataKey,
    stroke: defaultTheme[index]?.[0],
    fill: defaultTheme[index]?.[1],
    ...(areaItem || {}),
  }))

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
        />

        <Tooltip />

        <>
          {dataList.map((areaItem, index, arr) => (
            <Axis
              key={areaItem.dataKey}
              {...(areaItem || {})}
            >
              {totalKeyName && index === arr.length - 1 && <LabelList dataKey={totalKeyName} position='top' />}
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
  yAxisMaxKeyName: PropTypes.string,
  totalKeyName: PropTypes.string,
}

export default CartesianChart
