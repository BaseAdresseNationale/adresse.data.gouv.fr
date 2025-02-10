import { PanelDetailsItemWithDesc } from './PanelDetailsItemWithDesc'

export interface CertificationConfigEntry {
  className: string
  message: string
  desc: string
}

interface PanelDetailsCertificationProps extends React.HTMLAttributes<HTMLLIElement> {
  certificationConfig: Record<(0 | 1), CertificationConfigEntry>
  isCertified: boolean
}

export const PanelDetailsCertification = ({ certificationConfig, isCertified, className, ...props }: PanelDetailsCertificationProps) => {
  const certificationLevel = isCertified ? 1 : 0

  return (
    <PanelDetailsItemWithDesc
      {...props}
      message={certificationConfig[certificationLevel].message}
      desc={certificationConfig[certificationLevel].desc}
      className={
        `${certificationConfig[certificationLevel].className} `
        + `isIsolated `
        + ` ${className}`
      }
    />
  )
}
