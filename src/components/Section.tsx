import { fr } from '@codegouvfr/react-dsfr'

const colorTheme = {
  primary: fr.colors.decisions.background.alt.blueFrance.default,
  secondary: fr.colors.decisions.background.alt.pinkTuile.default,
}

export default function Section({
  children,
  pageTitle,
  title,
  color,
}: {
  children: React.ReactNode
  pageTitle?: string
  title?: string
  color?: 'primary' | 'secondary'
}) {
  return (
    <section
      className="fr-container-fluid"
      style={{
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
