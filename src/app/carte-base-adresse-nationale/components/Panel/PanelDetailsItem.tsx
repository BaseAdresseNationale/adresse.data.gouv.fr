import {
  PanelDetailsItemStyle,
  PanelDetailsItemContent,
} from './PanelStyles'

interface PanelDetailsItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode
}

export const PanelDetailsItem = ({ children, ...props }: PanelDetailsItemProps) => (
  <PanelDetailsItemStyle {...props}>
    <PanelDetailsItemContent>
      {children}
    </PanelDetailsItemContent>
  </PanelDetailsItemStyle>
)
