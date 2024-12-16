import {
  LegendWrapper,
  LegendDialog,
  LegendMessage,
} from './Legend.styles'

interface MapDataLoaderProps {
  children: React.ReactNode
  className?: string
  isVisible: boolean
}

function Legend({ children, className, isVisible }: MapDataLoaderProps) {
  return (
    <LegendWrapper $isVisible={isVisible} className={className}>
      <LegendDialog>
        <LegendMessage>
          {children}
        </LegendMessage>
      </LegendDialog>
    </LegendWrapper>
  )
}

export default Legend
