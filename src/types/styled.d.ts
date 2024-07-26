import 'styled-components'
import { theme } from '../styled-components/theme'

type Theme = typeof theme

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
