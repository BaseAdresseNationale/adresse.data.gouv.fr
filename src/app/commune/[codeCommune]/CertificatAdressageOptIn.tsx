'use client'

import { useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import Section from '@/components/Section'

import {
  CertificatAdressageOptInActionsWrapper,
  StyledIframeWrapper,
  StyledIframe,
} from './CertificatAdressageOptIn.styles'

import { BANCommune } from '@/types/api-ban.types'

interface CertificatAdressageOptInProps {
  district: BANCommune
}

function CertificatAdressageOptIn({ district }: CertificatAdressageOptInProps) {
  const [isConfigDistrictVisible, setIsConfigDistrictVisible] = useState(false)
  const iframeSRC = 'https://grist.numerique.gouv.fr/o/ban/forms/4eCgRqqpyXW5FMoZzQ3nNm/4'

  return (
    <div>
      <link href={iframeSRC} rel="prefetch" />
      <CertificatAdressageOptInActionsWrapper>
        <Button
          key="set-config"
          iconId="ri-settings-line"
          onClick={() => setIsConfigDistrictVisible(!isConfigDistrictVisible)}
        >
          Configurer les options de la commune
        </Button>
      </CertificatAdressageOptInActionsWrapper>

      <Section title={`Configuration des options pour la commune de ${district.nomCommune}`} theme="grey" isVisible={isConfigDistrictVisible}>
        <p>
          <i>
            Cette fonctionnalité est en développement.
            Vous pouvez vous inscrire en liste d’attente pour l’activation
            du certificat d’adressage pour votre commune.
          </i>
        </p>
        <StyledIframeWrapper>
          <StyledIframe src={iframeSRC} width="100%" height="800" frameBorder="0" />
        </StyledIframeWrapper>
      </Section>
    </div>
  )
}

export default CertificatAdressageOptIn
