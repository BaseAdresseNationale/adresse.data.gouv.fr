import territories from '@/data/territories.json'
import TOMCard from './TOMCard'
import { Grid, PanelContainer, PanelHeader, PanelContent } from './PanelTOM.styles'
import { useRouter } from 'next/navigation'
import { env } from 'next-runtime-env'
import { Territory } from '../ban-map/types'

interface PanelTOMProps {
  isVisible: boolean
}

export const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

const PanelTOM: React.FC<PanelTOMProps> = ({ isVisible }) => {
  const router = useRouter()
  if (!isVisible) return null

  const zoomTerritory = (territory: Territory) => {
    router.push(`${URL_CARTOGRAPHY_BAN}?tom=${territory.id}`)
  }

  return (
    <PanelContainer>
      <PanelHeader>
        Territoires d’outre-mer
      </PanelHeader>

      <PanelContent>
        <Grid>
          {territories.territories.map(territory => (
            <TOMCard
              key={territory.id}
              territory={territory}
              onSelect={zoomTerritory}
            />
          ))}
        </Grid>
      </PanelContent>
    </PanelContainer>
  )
}

export default PanelTOM
