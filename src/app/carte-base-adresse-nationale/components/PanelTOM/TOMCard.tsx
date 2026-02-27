import { Territory } from '../ban-map/types'
import { Card } from './PanelTOM.styles'
import Image from 'next/image'

interface TerritoryCardProps {
  territory: Territory
  onSelect: (territory: Territory) => void
}

const TOMCard: React.FC<TerritoryCardProps> = ({ territory, onSelect }) => {
  return (
    <Card onClick={() => onSelect(territory)}>
      <Image src={territory.icon} alt={territory.title} width={50} height={50} />
      <label>{territory.title}</label>
    </Card>
  )
}

export default TOMCard
