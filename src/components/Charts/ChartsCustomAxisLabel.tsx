export default function ChartsCustomAxisLabel({x, y, value}: ChartsCustomAxisLabelProps) {
  return (
    <text
      x={x} y={y} dy={-6} dx={14}
      fill='#666' fontSize={12} fontWeight={600} textAnchor='middle'
    >
      &#8776;{`${(Number(value) / 1000).toPrecision(2)}K`}
    </text>
  )
}

interface ChartsCustomAxisLabelProps {
  x?: number
  y?: number
  value?: string
}