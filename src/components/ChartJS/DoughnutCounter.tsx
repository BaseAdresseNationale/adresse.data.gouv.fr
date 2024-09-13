import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import styled from 'styled-components'

const StyledWrapper = styled.div`
    max-height: 300px;
    display: flex;
    flex-direction: column;
    padding: .5em;
    border: 1px solid lightgrey;
    border-radius: 5px;
    gap: 10px;

    .donut {
        max-width: 35%;
        margin: auto;
    }

    .title {
        font-size: 1.2em;
        font-weight: bold;
    }

    .value-up {
        font-size: 1.3em;
    }
`

ChartJS.register(ArcElement, Tooltip, Legend)

interface DoughnutCounterProps {
  title: string
  valueUp: string
  valueDown: string
  data: any
  options: any
}

export default function DoughnutCounter({ title, valueUp, valueDown, data, options }: DoughnutCounterProps) {
  return (
    <StyledWrapper>
      <div className="title">{title}</div>
      <div className="value-up">{valueUp}</div>
      <div className="donut">
        <Doughnut data={data} options={options} />
      </div>
      <div className="value-down">{valueDown}</div>
    </StyledWrapper>
  )
}
