import { createGlobalStyle } from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'

const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  scroll-behavior: smooth;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

// Quik fix for DSFR Table component
.fr-table > table {
  display: table;
}

h1, h2, h3, h4, h5, h6 {
  &[data-prefix]::before {
    content: attr(data-prefix);
    display: block;
    font-size: 0.85rem;
    line-height: 1.5;
  }
}
`

export default GlobalStyle
