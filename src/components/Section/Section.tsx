import { fr } from '@codegouvfr/react-dsfr'
import appTheme from '@/theme'
import type { ColorTheme } from '@/theme'

interface SectionProps {
  children: React.ReactNode
  pageTitle?: string
  title?: string
  theme?: ColorTheme
  classNameWrapper?: string
  style?: React.CSSProperties
  className?: string
}

function Section({
  children,
  pageTitle,
  title,
  theme,
  classNameWrapper,
  style,
  className,
}: SectionProps) {
  return (
    <section
      className={`fr-container-fluid ${classNameWrapper || ''}`}
      style={{
        ...style,
        ...(theme ? { backgroundColor: appTheme.colors[theme].bg } : {}),
      }}
    >
      <div
        className={`fr-container ${className || ''}`}
        style={{
          padding: fr.spacing('3w'),
        }}
      >
        {pageTitle && <h1>{pageTitle}</h1>}
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </section>
  )
}

export default Section
