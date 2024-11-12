import { ParcellesWrapper, Parcelle } from './ParcellesList.styles'

interface ParcellesListProps {
  parcelles: string[]
}

function ParcellesList({ parcelles }: ParcellesListProps) {
  return (
    <div>
      {parcelles.length > 0
        ? (
            <ParcellesWrapper>
              {parcelles.map(parcelle => (
                <Parcelle key={parcelle}>{parcelle}</Parcelle>
              ))}
            </ParcellesWrapper>
          )
        : 'Aucune parcelle cadastrale n’est référencée'}
    </div>
  )
}

export default ParcellesList
