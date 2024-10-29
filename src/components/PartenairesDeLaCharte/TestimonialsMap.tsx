'use client'

import styled from 'styled-components'

const StyledTestimonialsMaps = styled.div`
    margin: 2em 0;
    a {
        margin-top: 1em;
    }
`

export function TestimonialsMaps() {
  return (
    <StyledTestimonialsMaps>
      <h2>Carte des témoignages</h2>
      <iframe width="100%" height="400px" src="https://umap.openstreetmap.fr/fr/map/carte-des-temoignages_953200?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&allowEdit=false&moreControl=false&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=false&onLoadPanel=caption&captionBar=false&captionMenus=false" />
      <a href="https://umap.openstreetmap.fr/en/map/carte-des-temoignages_953200#6/46.149/8.240" target="_blank" rel="noreferrer">Voir en plein écran</a>
    </StyledTestimonialsMaps>
  )
}
