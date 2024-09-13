import { createGlobalStyle } from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'


const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}
`

export default GlobalStyle
