'use client'

import styled from 'styled-components'

import { PanelDetailsItemWithDesc } from '../PanelStyles/PanelStyles'

export const DistrictDetailsWrapper = styled.ul`
  padding: 0;
  margin: 0 0 4rem;
  font-size: 0.9rem;
  line-height: 1.5;
`

interface CertificationConfigEntry {
  className: string
  message: string
  desc: string
}

interface DistrictDetailsCertificationProps extends React.HTMLAttributes<HTMLLIElement> {
  certificationConfig: Record<(0 | 1 | 2), CertificationConfigEntry>
  origin: string
  certificatedAddressPercent: number
}

export const DistrictDetailsCertification = ({ certificationConfig, origin, certificatedAddressPercent, className, children, ...props }: DistrictDetailsCertificationProps) => {
  const certificationLevel = origin === 'bal' && certificatedAddressPercent > 98
    ? 2
    : (
        certificatedAddressPercent > 0
          ? 1
          : 0
      )

  return (
    <PanelDetailsItemWithDesc
      {...props}
      message={certificationConfig[certificationLevel].message.replace('{{CERTIFICATED_PERCENT}}', `${certificatedAddressPercent}`)}
      desc={certificationConfig[certificationLevel].desc}
      className={
        `${certificationConfig[certificationLevel].className} `
        + `isIsolated `
        + ` ${className}`
      }
    />
  )
}
