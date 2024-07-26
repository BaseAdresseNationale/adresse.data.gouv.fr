import { fr } from '@codegouvfr/react-dsfr'

const colorTheme = {
  primary: fr.colors.decisions.background.alt.blueFrance.default,
  secondary: fr.colors.decisions.background.alt.pinkTuile.default,
}

export interface SectionProps {
  children: React.ReactNode
  pageTitle?: string
  title?: string
  color?: 'primary' | 'secondary'
  style?: React.CSSProperties
  className?: string
}

export default function Section({
  children,
  pageTitle,
  title,
  color,
  style,
  className,
}: SectionProps) {
  return (
    <section
      className={className ? `fr-container-fluid ${className}` : 'fr-container-fluid'}
      style={{
        ...style,
        ...(color ? { backgroundColor: colorTheme[color] } : {}),
      }}
    >
      <div
        className="fr-container"
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
