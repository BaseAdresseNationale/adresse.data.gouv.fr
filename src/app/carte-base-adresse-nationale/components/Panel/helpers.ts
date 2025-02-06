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

const defaultPaddingParams = {
  padding: 30,
  mobileHeader: 100,
  mobileFooter: 250,
  panelWidth: 400,
}

export const getMapPadding = ({ isMobileView, isMenuVisible, paddingParams: paddingParamsProps }: MapAnimationOptions) => {
  const paddingParams = {
    ...defaultPaddingParams,
    ...(paddingParamsProps || {}),
  }

  const defaultPadding = {
    top: defaultPaddingParams.padding || 0,
    bottom: defaultPaddingParams.padding || 0,
    left: defaultPaddingParams.padding || 0,
    right: defaultPaddingParams.padding || 0,
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
      left: paddingParams.panelWidth + (paddingParams.padding * 2),
      right: paddingParams.padding * 2,
    }
  )) || defaultPadding

  return padding
}
