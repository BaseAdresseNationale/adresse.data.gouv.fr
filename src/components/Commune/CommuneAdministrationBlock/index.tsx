'use client'

import Link from 'next/link'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import { BANCommune, CertificateTypeEnum, CertificateTypeLabel } from '@/types/api-ban.types'
import { AdministrationBlockWrapper } from './CommuneAdministrationBlock.styles'

const LANGUE_LABELS: Record<string, string> = {
  'fra': 'français',
  'bre': 'breton',
  'eus': 'basque',
  'gsw': 'alsacien',
  'cos': 'corse',
  'gcr': 'créole-guyanais',
  'gcf': 'créole-martiniquais-guadeloupéen',
  'rcf': 'créole-réunionnais',
  'swb': 'mahorais',
  'oci': 'occitan',
  'cat': 'catalan',
  'pcd': 'picard',
  'oc-provenc': 'provençal',
  'oc-nicard': 'niçard',
  'vls': 'flamand',
  'fr-gallo': 'gallo',
}

interface CommuneAdministrationBlockProps {
  commune: BANCommune
}

export function CommuneAdministrationBlock({ commune }: CommuneAdministrationBlockProps) {
  const config = commune.config
  const certificate = config?.certificate ?? CertificateTypeEnum.DISABLED
  const defaultBalLang = config?.defaultBalLang
  const certificateLabel = CertificateTypeLabel[certificate] ?? 'Désactivé'

  const certificatTitle
    = certificate === CertificateTypeEnum.ALL
      ? `Le certificat d'adressage est activé pour la commune de ${commune.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`
      : certificate === CertificateTypeEnum.DISTRICT
        ? 'Les certificats sont téléchargeables depuis le site adresse.data.gouv.fr uniquement par les agents authentifiés de la mairie de la commune.'
        : undefined

  return (
    <AdministrationBlockWrapper>
      <header className="admin-block-header">
        <span className="admin-block-icon" aria-hidden>
          <span className="fr-icon fr-icon-government-line" aria-hidden="true" />
        </span>
        <h3 className="admin-block-title">
          Administration <Badge noIcon severity="info">BETA</Badge>
        </h3>
      </header>
      <div className="admin-recap">
        <div className="admin-recap-item">
          <label>
            <span className="fr-icon fr-icon-file-text-line" aria-hidden="true" />
            Certificat d&apos;adressage
          </label>
          {certificatTitle
            ? (
                <Tooltip key="certificat" kind="hover" title={certificatTitle}>
                  <span className="admin-recap-value admin-recap-value--active">
                    {certificateLabel}
                  </span>
                </Tooltip>
              )
            : (
                <span className="admin-recap-value admin-recap-value--active">
                  {certificateLabel}
                </span>
              )}
        </div>
        <div className="admin-recap-item">
          <label>
            <span className="fr-icon fr-icon-global-line" aria-hidden="true" />
            Langue principale des odonymes
          </label>
          <span className="admin-recap-value admin-recap-value--active">
            {defaultBalLang ? (LANGUE_LABELS[defaultBalLang] ?? defaultBalLang) : 'français'}
          </span>
        </div>
      </div>
      <footer className="admin-block-footer">
        <Link href="/admin#ma_commune" className="admin-block-footer-cta">
          <span className="fr-icon fr-icon-user-settings-line" aria-hidden="true" />
          <span>Activer ou gérer ces options</span>
          <span className="fr-icon fr-icon-arrow-right-line admin-block-footer-cta-arrow" aria-hidden="true" />
        </Link>
      </footer>
    </AdministrationBlockWrapper>
  )
}

export default CommuneAdministrationBlock
