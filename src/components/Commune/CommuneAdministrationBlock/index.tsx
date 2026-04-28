'use client'

import Link from 'next/link'
import Badge from '@codegouvfr/react-dsfr/Badge'
import { Tooltip } from '@codegouvfr/react-dsfr/Tooltip'
import Section from '@/components/Section'
import { BANCommune, CertificateTypeEnum, CertificateTypeLabel } from '@/types/api-ban.types'
import languesRegionales from '@/app/admin/components/DistrictActions/langues-regionales.json'

const LANGUE_LABELS: Record<string, string> = Object.fromEntries(
  (languesRegionales as { code: string, label: string }[]).map(l => [l.code, l.label]),
)

interface CommuneAdministrationBlockProps {
  commune: BANCommune
}

export function CommuneAdministrationBlock({ commune }: CommuneAdministrationBlockProps) {
  const config = commune.config ?? { certificate: CertificateTypeEnum.DISABLED }
  const certificate = config?.certificate ?? CertificateTypeEnum.DISABLED
  const defaultBalLang = config?.defaultBalLang
  const certificateLabel = CertificateTypeLabel[certificate] ?? 'Désactivé'

  const certificatTitle
    = certificate === CertificateTypeEnum.ALL
      ? `Le certificat d'adressage est activé pour la commune de ${commune.nomCommune}, les téléchargements sont disponibles via l'explorateur BAN.`
      : certificate === CertificateTypeEnum.DISTRICT
        ? 'Les certificats sont téléchargeables depuis le site adresse.data.gouv.fr uniquement par les agents authentifiés de la mairie de la commune.'
        : 'Le certificat d\'adressage est désactivé pour cette commune. Les téléchargements ne sont pas disponibles.'

  const langueLabel = defaultBalLang ? (LANGUE_LABELS[defaultBalLang] ?? defaultBalLang) : 'français'

  const certificateDisplay
    = certificate === CertificateTypeEnum.ALL
      ? <><strong className="fr-text-default--success">Activé</strong> — Téléchargement accessible à tous</>
      : certificate === CertificateTypeEnum.DISTRICT
        ? <><strong className="fr-text-default--warning">Restreint à la mairie</strong> — Réservé aux agents de la mairie</>
        : <><strong className="fr-text-default--grey">Désactivé</strong> — Les certificats ne sont pas disponibles</>

  return (
    <Section
      id="administration"
      title={(
        <>
          Administration <Badge noIcon severity="info">BETA</Badge>
        </>
      )}
      theme="secondary"
    >
      <p className="fr-text fr-text--sm fr-mb-2w">
        Réservé aux agents habilités de la commune. Vous pouvez consulter les options de la commune ci-dessous et les modifier depuis l&apos;espace administration.
      </p>

      <dl className="fr-list fr-list--none fr-text--sm">
        <dt className="fr-mb-0 fr-mt-0">
          <i className="ri-file-paper-2-line fr-mr-1v" aria-hidden />
          Certificat d&apos;adressage
        </dt>
        <dd className="fr-ml-0 fr-mb-1w fr-mt-0">
          <Tooltip kind="hover" title={certificatTitle}>{certificateDisplay}</Tooltip>
        </dd>
        <dt className="fr-mb-0 fr-mt-0">
          <i className="fr-icon fr-icon-global-line fr-mr-1v" aria-hidden />
          Langue principale des noms de voies et lieux-dits
        </dt>
        <dd className="fr-ml-0 fr-mb-0 fr-mt-0">
          {langueLabel}
        </dd>
      </dl>

      <p className="fr-text fr-text--sm fr-mb-0">
        Pour modifier les options de la commune:
      </p>
      <Link
        href="/admin#ma_commune"
        className="fr-link fr-link--icon-right fr-icon-arrow-right-line fr-mt-1w"
      >
        Accéder à l&apos;espace administration
      </Link>
    </Section>
  )
}

export default CommuneAdministrationBlock
