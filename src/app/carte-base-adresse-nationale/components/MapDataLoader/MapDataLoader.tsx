import {
  LoaderWrapper,
  LoaderDialog,
  LoaderIconWrapper,
  LoaderMessage,
} from './MapDataLoader.styles'

interface MapDataLoaderProps {
  children: React.ReactNode
  isLoading: boolean
}

function MapDataLoader({ children, isLoading }: MapDataLoaderProps) {
  return (
    <LoaderWrapper $isVisible={!isLoading}>
      <LoaderDialog>
        <LoaderIconWrapper className="loading">
          <i className="loader-icon ri-refresh-line" />
        </LoaderIconWrapper>
        <LoaderMessage>
          {children}
        </LoaderMessage>
      </LoaderDialog>
    </LoaderWrapper>
  )
}

export default MapDataLoader
