import { CrossIconWrapper } from './CenterControl.styles'

interface CenterControlProps {
  isDisabled?: boolean
  handleClick: () => void
}

function CenterControl({ isDisabled = false, handleClick }: CenterControlProps) {
  return (
    <button
      disabled={isDisabled}
      title="Recentrer la carte"
      onClick={handleClick}
    >
      <CrossIconWrapper className="maplibregl-ctrl cross-icon">
        <span
          className="ri-focus-3-line"
          aria-hidden="true"
        />
      </CrossIconWrapper>
    </button>
  )
}

export default CenterControl
