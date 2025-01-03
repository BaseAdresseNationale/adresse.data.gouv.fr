'use client'

import styled from 'styled-components'

import { PanelDetailsItemWithDesc } from '../PanelStyles/PanelStyles'

export const AddressDetailsWrapper = styled.ul`
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

interface AddressDetailsCertificationProps extends React.HTMLAttributes<HTMLLIElement> {
  certificationConfig: Record<(0 | 1), CertificationConfigEntry>
  isCertified: boolean
}

export const AddressDetailsCertification = ({ certificationConfig, isCertified, className, ...props }: AddressDetailsCertificationProps) => {
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
