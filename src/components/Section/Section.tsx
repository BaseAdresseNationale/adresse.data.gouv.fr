import { fr } from '@codegouvfr/react-dsfr'
import appTheme from '@/theme'
import type { ColorTheme } from '@/theme'

import { SectionBlock, SectionFooter } from './Section.styles'

interface SectionProps {
  children: React.ReactNode
  pageTitle?: string
  title?: string
  footer?: React.ReactNode
  theme?: ColorTheme
  classNameWrapper?: string
  style?: React.CSSProperties
  className?: string
  id?: string
  isVisible?: boolean
}

function Section({
  children,
  pageTitle,
  title,
  footer,
  theme,
  classNameWrapper,
  style,
  className,
  id,
  isVisible,
}: SectionProps) {
  return (
    <SectionBlock
      id={id}
      className={`fr-container-fluid ${classNameWrapper || ''}`}
      style={{
        ...style,
        ...(theme ? { backgroundColor: appTheme.colors[theme].bg } : {}),
      }}
      $isVisible={isVisible}
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
        {footer && <SectionFooter>{footer}</SectionFooter>}
      </div>
    </SectionBlock>
  )
}

export default Section
