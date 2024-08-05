import appTheme from '@/theme'
import type { ColorTheme } from '@/theme'

interface BadgeCategoryProps {
  children: React.ReactNode
  theme?: ColorTheme
}

function BadgeCategory({ children, theme = 'secondary' }: BadgeCategoryProps) {
  return (
    <div className="fr-badge fr-badge--sm" style={theme && { backgroundColor: appTheme.colors[theme].badge }}>{children}</div>
  )
}

export default BadgeCategory
