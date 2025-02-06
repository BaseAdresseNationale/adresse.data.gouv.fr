'use client'

import styled from 'styled-components'

const StyledPartenairesMap = styled.div`
    margin: 2em 0;
    a {
        margin-top: 1em;
    }
`

interface PartenairesMapProps {
  showTitle?: boolean
}

export function PartenairesMap({ showTitle }: PartenairesMapProps) {
  return (
    <StyledPartenairesMap>
      {showTitle && <h2>Carte des partenaires</h2>}
      <iframe width="100%" height="400px" src="https://umap.openstreetmap.fr/fr/map/partenaires-de-la-charte-de-la-base-adresse-locale_953281#5/46.997/2.262?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=false&onLoadPanel=caption&captionBar=false&captionMenus=false" />
      <a href="https://umap.openstreetmap.fr/fr/map/partenaires-de-la-charte-de-la-base-adresse-locale_953281#6/47.242/3.746" target="_blank" rel="noreferrer">Voir en plein écran</a>
    </StyledPartenairesMap>
  )
}
