import { PlotsListTitle, PlotsListWrapper, Plot, PlotsRest } from './PlotsList.styles'

interface ParcellesListProps {
  plots: string[]
}

function PlotsList({ plots = [] }: ParcellesListProps) {
  const plotLlimit = 5
  const plotsSubList = plots.slice(0, plotLlimit)
  const plotsRest = plots.length > plotLlimit ? plots.length - plotLlimit : 0

  return (
    <div>
      {plots.length > 0
        ? (
            <>
              <PlotsListTitle>{plots.length} {plots.length > 1 ? 'Parcelles cadastrales' : 'Parcelle cadastrale'}</PlotsListTitle>
              <PlotsListWrapper>
                {plotsSubList.map(parcelle => (
                  <Plot key={parcelle}>{parcelle}</Plot>
                ))}
                {plotsRest > 0 && (
                  <PlotsRest>... et {plotsRest} {plotsRest > 1 ? 'autres parcelles' : 'autre parcelle'}.</PlotsRest>
                )}
              </PlotsListWrapper>
            </>
          )
        : 'Aucune parcelle cadastrale n’est référencée'}
    </div>
  )
}

export default PlotsList
