import { PanelDetailsItemWithDesc } from './PanelDetailsItemWithDesc'

import type { CertificationConfigEntry } from './PanelDetailsCertification'

interface PanelDetailsCertificationsProps extends React.HTMLAttributes<HTMLLIElement> {
  certificationConfig: Record<(0 | 1 | 2), CertificationConfigEntry>
  origin: string
  certificatedPercent: number
}

export const PanelDetailsCertifications = ({ certificationConfig, origin, certificatedPercent, className, children, ...props }: PanelDetailsCertificationsProps) => {
  const certificationLevel = origin === 'bal' && certificatedPercent > 98
    ? 2
    : (
        certificatedPercent > 0
          ? 1
          : 0
      )

  return (
    <PanelDetailsItemWithDesc
      {...props}
      message={certificationConfig[certificationLevel].message.replace('{{CERTIFICATED_PERCENT}}', `${certificatedPercent}`)}
      desc={certificationConfig[certificationLevel].desc}
      className={
        `${certificationConfig[certificationLevel].className} `
        + `isIsolated `
        + ` ${className}`
      }
    />
  )
}
