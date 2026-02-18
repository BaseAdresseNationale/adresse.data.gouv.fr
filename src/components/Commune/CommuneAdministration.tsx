'use client'

import { BANCommune, CertificateTypeEnum } from '@/types/api-ban.types'
import Section from '../Section'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import { CommuneConfigItem } from './CommuneActions/CommuneActions.styles'
import Link from 'next/link'

// Helper component for Tooltip with CommuneConfigItem
const TooltipWithCommuneConfigItem = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Tooltip kind="hover" title={title}>
    <CommuneConfigItem className="ri-file-paper-2-line">{children}</CommuneConfigItem>
  </Tooltip>
)

function CommuneAdministration(district: BANCommune) {
  const tooltipTitleAll = `Le certificat d’adressage est activé pour la commune de ${district.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`
  const tooltipTitleDistrict = `Les certificats sont téléchargeables depuis le site adresse.data.gouv.fr uniquement par les agents authentifiés de la mairie de la commune.`

  const renderCertificateTypeContent = () => {
    if (district?.config?.certificate === CertificateTypeEnum.ALL) {
      return (
        <TooltipWithCommuneConfigItem title={tooltipTitleAll}>
          Certificat d’adressage :{' '}
          <b>Activé</b>
        </TooltipWithCommuneConfigItem>
      )
    }
    else if (district?.config?.certificate === CertificateTypeEnum.DISTRICT) {
      return (
        <TooltipWithCommuneConfigItem title={tooltipTitleDistrict}>
          Certificat d’adressage :{' '}
          <b>Restreint à la mairie</b>
        </TooltipWithCommuneConfigItem>
      )
    }
    else if (district?.config?.certificate === CertificateTypeEnum.DISABLED) {
      return (
        <span style={{ color: 'var(--text-action-high-blue-france)', fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: 700 }}>
          Activation du certificat d’adressage
        </span>
      )
    }
    return null
  }

  return (
    <Section
      title={(<>Administration <Badge noIcon severity="info">BETA</Badge></>)}
      theme="grey"
    >
      <div>
        <div className="fr-mb-3w">
          {renderCertificateTypeContent()}
        </div>
        <div>
          L’activation et la gestion du certificat d’adressage se font désormais depuis votre espace{' '}
          <Link href="/admin#ma_commune" className="fr-link">
            Ma commune
          </Link>.
        </div>
      </div>
    </Section>
  )
}

export default CommuneAdministration
