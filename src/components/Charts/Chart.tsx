import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

import { defaultTheme } from './ColorTheme'
import AxisTickByDate from './AxisTicksByDate'
import ChartsCustomTooltip from './ChartsCustomTooltips'
import ChartsCustomAxisLabel from './ChartsCustomAxisLabel'
import React from 'react'
import { FC } from 'react'

const renderColorfulLegendText = (value: any, entry: { color: string }) => {
  const { color } = entry
  return <span style={{ color }}>{ value }</span>
}
const yAxisTickFormatter = (value: any): string => {
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

interface TypeComponent {
  chart: React.ElementType
  axis: any
}
const typeComponents: Record<string, TypeComponent> = {
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

// 'yyyy-MM' ou 'yyyy-MM-dd' -> timestamp
const periodToTime = (period: string): number => {
  const [year, month = 1, day = 1] = period.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}

// timestamp -> 'yyyy-MM' (format attendu par AxisTickByDate)
const timeToPeriod = (time: number): string => {
  const date = new Date(time)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

// Un tick au 1er janvier de chaque année couverte par les données
const getYearlyTicks = (data: any[] = []): number[] => {
  const years = data.map(({ period }) => Number(period.split('-')[0]))
  if (years.length === 0) {
    return []
  }

  const firstTime = periodToTime(data[0].period)
  const ticks = []
  for (let year = Math.min(...years); year <= Math.max(...years); year++) {
    const time = Date.UTC(year, 0, 1)
    if (time >= firstTime) {
      ticks.push(time)
    }
  }

  return ticks
}

interface CartesianChartProps {
  type: 'area' | 'bar' | 'line' | 'scatter'
  data?: any[]
  axisDef: Record<string, any>
  totalKeyName?: string
  // Axe des abscisses proportionnel au temps (dates irrégulières), au lieu d'un point par entrée
  continuousXAxis?: boolean
}

export default function CartesianChart({ type, data, axisDef, totalKeyName: totalKeyNameProps, continuousXAxis }: CartesianChartProps) {
  const dataList = Object.entries(axisDef).map(([dataKey, areaItem], index) => ({
    ...defaultArea,
    dataKey,
    stroke: areaItem?.stroke || defaultTheme[index]?.[0],
    fill: areaItem?.fill || defaultTheme[index]?.[1],
    ...(areaItem || {}),
  }))
  const totalKeyName = totalKeyNameProps || Object.values(axisDef).find(({ ordinate }) => ordinate)?.dataKey
  const yAxisMaxKeyName = dataList.find(({ ordinate }) => Boolean(ordinate))?.dataKey
  const yAxisMaxValue = yAxisMaxKeyName
    ? (data || []).reduce(
        (acc, item) => {
          return Math.max(acc, item?.[yAxisMaxKeyName] ? Number(item[yAxisMaxKeyName]) : 0)
        }, 0)
    : 'auto'

  if (typeComponents[type]) {
    // Une série peut définir son propre `chartType` pour mélanger les styles (ex: ligne + points)
    const isComposed = dataList.some(({ chartType }) => chartType && chartType !== type)
    const Chart = isComposed ? ComposedChart : typeComponents[type].chart
    return (
      <ResponsiveContainer width="100%" height={560}>
        <Chart
          data={data}
          outerRadius={90}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {continuousXAxis
            ? (
                <XAxis
                  dataKey={(entry: Record<string, any>) => periodToTime(entry.period)}
                  type="number"
                  scale="time"
                  domain={['dataMin', 'dataMax']}
                  ticks={getYearlyTicks(data)}
                  angle={-45}
                  tick={({ payload, ...props }: Record<string, any>) => <AxisTickByDate {...props} payload={{ value: timeToPeriod(payload.value) }} />}
                />
              )
            : (
                <XAxis
                  dataKey="period"
                  angle={-45}
                  padding={{
                    left: 0,
                    right: 0,
                  }}
                  tick={<AxisTickByDate />}
                />
              )}
          <YAxis
            dataKey={yAxisMaxKeyName}
            tickFormatter={yAxisTickFormatter}
            domain={[0, yAxisMaxValue === 'auto' ? yAxisMaxValue : `dataMax + ${'1'.padEnd((yAxisMaxValue).toString().length - 1, '0')}`]}
          />

          <Tooltip content={<ChartsCustomTooltip />} />

          <>
            {dataList.map(({ chartType, allowMissingValues, ...areaItem }, index, arr) => {
              const Axis = typeComponents[chartType || type].axis
              return (
                <Axis
                  key={areaItem.dataKey}
                  {...(areaItem || {})}
                  name={areaItem.dataKey}
                  dataKey={(entry: Record<string, any>) => {
                    const value = entry?.[areaItem.dataKey]
                    // `undefined` n'est pas affiché par Recharts, contrairement à 0
                    return allowMissingValues && value == null ? undefined : Number(value || 0)
                  }}
                >
                  {totalKeyName && index === arr.length - 1 && <LabelList dataKey={(entry: Record<string, any>) => entry?.[totalKeyName] || 0} position="top" content={<ChartsCustomAxisLabel />} />}
                </Axis>
              )
            })}
          </>

          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="left"
            wrapperStyle={{
              position: 'absolute',
              paddingBottom: '20px',
              paddingTop: '50px',
            }}
            iconType="circle"
            // Garde l'ordre des séries (Recharts trie par ordre alphabétique par défaut)
            itemSorter={null}
            // formatter={renderColorfulLegendText}
          />
        </Chart>

      </ResponsiveContainer>
    )
  }

  return null
}
