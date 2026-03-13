import { dateFormatOptions } from '@/views/data/config'

const humanizeNumber = (value: number): string | number => Number.isNaN(value) ? value : value.toLocaleString(undefined, { minimumFractionDigits: 0 })

export default function ChartsCustomTooltip({ active, payload, label: labelProp }: ChartsCustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const { label, toolipLabel, period, total, ...otherFields } = payload[0].payload || {}
    const [year, month = 0, day = 0] = period.split('-')
    const date = new Date(year, month - 1, day || 1)
    const fieldsList = Object.keys(otherFields)
    const filtredFields = payload.filter(({ name }: Record<string, any>) => fieldsList.includes(name))

    type filtredFieldseObject = {
      name: string
      value: string
      color: string
    }
    return (
      <>
        <div className="custom-tooltip">
          <p><span className="label">{date.toLocaleDateString('fr-FR', dateFormatOptions.dateFormatOptionsLongDate)}</span></p>
          <h5>{`${toolipLabel || label || labelProp}${total ? `${'\u00A0'}: ${humanizeNumber(total)}` : ''}`}</h5>
          <ul>{filtredFields.map(({ name, value, color }: filtredFieldseObject) => (
            <li key={name} style={{ color }}>{`${name} : ${humanizeNumber(Number(value))}`}</li>
          ))}
          </ul>
        </div>

        <style jsx>{`
          .custom-tooltip {
            background-color: white;
            border: 1px solid #ccc;
            padding: 10px;
          }
          .label {
            font-weight: bold;
          }
          .desc {
            font-style: italic;
          }
      `}</style>
      </>
    )
  }

  return null
}

interface ChartsCustomTooltipProps {
  active?: boolean
  payload?: Record<string, any>
  label?: string
}
