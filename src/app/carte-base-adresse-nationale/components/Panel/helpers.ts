import { fr } from '@codegouvfr/react-dsfr'

export const isMobileView = (sizeLabel: 'lg' | 'md' | 'sm' = 'lg') => {
  const windowWidth = window?.innerWidth || 0
  return windowWidth > 0 && windowWidth < fr.breakpoints.getPxValues()[sizeLabel]
}

interface MapAnimationOptions {
  isMobileView: boolean
  isMenuVisible: boolean
  paddingParams?: {
    padding: number
    mobileHeader: number
    mobileFooter: number
    panelWidth: number
  }
}

const defaultPadding = {
  padding: 30,
  mobileHeader: 100,
  mobileFooter: 250,
  panelWidth: 400,
}

export const getMapAnimationOption = ({ isMobileView, isMenuVisible, paddingParams: paddingParamsProps }: MapAnimationOptions) => {
  const paddingParams = {
    ...defaultPadding,
    ...(paddingParamsProps || {}),
  }

  const padding = (isMobileView && (
    {
      top: paddingParams.mobileHeader / 2,
      bottom: paddingParams.mobileFooter / 2,
      left: paddingParams.padding,
      right: paddingParams.padding,
    }
  )) || (isMenuVisible && (
    {
      top: paddingParams.padding,
      bottom: paddingParams.padding,
      left: paddingParams.panelWidth * 1.5,
      right: paddingParams.panelWidth / 2,
    }
  )) || paddingParams.padding || 0

  return { padding }
}
