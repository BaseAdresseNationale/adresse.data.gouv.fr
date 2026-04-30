'use client'

import { Fragment, type CSSProperties, useMemo } from 'react'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import {
  CERTIFICATE_ISSUER_DETAILS_MAX_CHARS_PER_LOGICAL_LINE,
  CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES,
  certificateIssuerDetailsEffectiveMaxChars,
  issuerDetailsDefaultHintWithCommuneVillePrefix,
} from '@/lib/certificate-issuer-config'
import CommuneLogo, { COMMUNE_LOGO_PAGE_PRESET } from '@/components/CommuneLogo/CommuneLogo'
import { collectiviteFrCommuneAuthUrl } from '@/lib/collectivite-fr-url'
import { type BANConfig } from '@/types/api-ban.types'

const ISSUER_DETAILS_MAX_TOTAL_CHARS = certificateIssuerDetailsEffectiveMaxChars()

const ISSUER_TEXTAREA_SHARED_STYLE: CSSProperties = {
  font: '400 1rem/1.5 var(--font-family-default, Marianne, arial, sans-serif)',
  padding: '0.5rem 1rem',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  overflowWrap: 'break-word',
  tabSize: 4,
  boxSizing: 'border-box',
  WebkitTextSizeAdjust: '100%',
  textSizeAdjust: '100%',
}

type CertificatePdfCustomizationFieldsBase = {
  configState: BANConfig | undefined
  handleUpdateConfig: (c: BANConfig) => void
  readOnly: boolean
  isUserAuthorized: boolean
  hasBanId: boolean
  nomCommune: string | undefined
  /** Pour afficher l’emblème réel dans l’en-tête de l’onglet « Emblème communal ». */
  codeCommune?: string
}

export type CertificatePdfCustomizationFieldsProps = CertificatePdfCustomizationFieldsBase & (
  | { variant: 'logo' }
  | {
    variant: 'service'
    issuerHeaderBlockForInput: string
    issuerDetailsDefaultHint?: string
    communePopulation?: number
    onIssuerHeaderBlockInput: (raw: string) => void
  }
)

export function CertificatePdfCustomizationFields(props: CertificatePdfCustomizationFieldsProps) {
  const {
    configState,
    handleUpdateConfig,
    readOnly,
    isUserAuthorized,
    hasBanId,
    nomCommune,
    codeCommune,
    variant,
  } = props

  const logoOn = configState?.certificateShowLogo ?? false
  const collectiviteAuthHref = collectiviteFrCommuneAuthUrl(nomCommune)

  const disabled = readOnly || !isUserAuthorized || !hasBanId

  const issuerHeaderBlockForInput = variant === 'service' ? props.issuerHeaderBlockForInput : ''
  const issuerDetailsDefaultHint = variant === 'service' ? props.issuerDetailsDefaultHint : undefined
  const communePopulation = variant === 'service' ? props.communePopulation : undefined
  const onIssuerHeaderBlockInput = variant === 'service' ? props.onIssuerHeaderBlockInput : undefined

  const issuerDetailsDefaultHintAdjusted = useMemo(
    () => issuerDetailsDefaultHintWithCommuneVillePrefix(
      issuerDetailsDefaultHint,
      nomCommune,
      communePopulation,
    ),
    [issuerDetailsDefaultHint, nomCommune, communePopulation],
  )

  const issuerHeaderPlaceholder = useMemo(() => {
    const hint = issuerDetailsDefaultHintAdjusted?.trim()
    if (!hint) return undefined
    return [
      'Texte utilisé par défaut si vous ne saisissez rien',
      '',
      hint,
    ].join('\n')
  }, [issuerDetailsDefaultHintAdjusted])

  const { issuerLines, lineCharStats } = useMemo(() => {
    const lines = issuerHeaderBlockForInput.replace(/\r\n/g, '\n').split('\n')
    const maxLen = CERTIFICATE_ISSUER_DETAILS_MAX_CHARS_PER_LOGICAL_LINE
    const maxLines = CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES
    const lineCharStats = lines.map((line, i) => ({
      lineNumber: i + 1,
      length: line.length,
      maxLen,
      over: line.length > maxLen || i >= maxLines,
    }))
    return { issuerLines: lines, lineCharStats }
  }, [issuerHeaderBlockForInput])
  const hasIssuerText = issuerHeaderBlockForInput.length > 0

  if (variant === 'logo') {
    return (
      <>
        <div className="fr-background-alt--grey fr-p-3w fr-mb-3w">
          <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
            <div className="fr-col-auto">
              {codeCommune
                ? (
                    <CommuneLogo
                      codeCommune={codeCommune}
                      alt=""
                      {...COMMUNE_LOGO_PAGE_PRESET}
                    />
                  )
                : (
                    <span
                      className="fr-icon fr-icon-image-line fr-text--xl"
                      style={{ color: 'var(--artwork-major-blue-france)' }}
                      aria-hidden
                    />
                  )}
            </div>
            <div className="fr-col">
              <p className="fr-text--sm fr-mb-1w">
                <strong>Emblème communal</strong>
              </p>
              <p className="fr-text--sm fr-mb-0 fr-hint-text">
                Visuel en haut à droite du certificat.
              </p>
            </div>
          </div>
        </div>

        <ToggleSwitch
          id="cert-toggle-show-logo"
          label="Afficher l&apos;emblème communal sur le certificat"
          helperText="Désactivé par défaut. Activez pour afficher l&apos;emblème communal sur le certificat."
          checked={logoOn}
          showCheckedHint
          labelPosition="left"
          disabled={disabled}
          inputTitle={logoOn
            ? 'Affiché sur le certificat — cliquer pour masquer'
            : 'Masqué par défaut — cliquer pour afficher sur le certificat'}
          onChange={checked => handleUpdateConfig({ ...configState, certificateShowLogo: checked } as BANConfig)}
          className="fr-mb-3w"
        />

        <div className="fr-background-alt--grey fr-p-3w fr-mb-0">
          <p className="fr-text--sm fr-mb-2w">
            <strong>Emblème communal</strong>
          </p>
          <p className="fr-text--sm fr-mb-2w">
            L&apos;emblème affiché sur ce site est celui du référentiel officiel de l&apos;
            <a
              href="https://collectivite.fr"
              className="fr-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Annuaire des Collectivités
            </a>
            {' '}
            (collectivite.fr). Il reprend le visuel associé à votre commune sur ce service public.
          </p>
          <p className="fr-text--sm fr-mb-2w">
            Pour <strong>modifier l&apos;emblème communal</strong> de votre collectivité, connectez-vous à l&apos;espace
            sécurisé de l&apos;annuaire (authentification sur collectivite.fr). Les changements effectués côté annuaire
            peuvent ensuite se refléter ici après mise à jour du référentiel.
          </p>
          <p className="fr-text--sm fr-mb-1w">
            Lien vers la fiche de votre commune (connexion) :
          </p>
          <p className="fr-mb-2w">
            <a
              href={collectiviteAuthHref}
              target="_blank"
              rel="noopener noreferrer"
              className="fr-link fr-link--icon-right fr-icon-external-link-line"
            >
              {collectiviteAuthHref}
            </a>
          </p>
          <p className="fr-hint-text fr-mb-0">
            Lorsque l&apos;interrupteur ci-dessus est activé, l&apos;emblème communal apparaît en haut à droite du
            certificat, à côté du bandeau Marianne et du bloc d&apos;adresse.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <div
        className="fr-p-3w fr-mb-0 fr-background-alt--blue-france"
        style={{
          border: '1px solid var(--border-default-grey)',
          borderLeftWidth: '0.25rem',
          borderLeftColor: 'var(--border-action-high-blue-france)',
          borderRadius: '0.25rem',
          overflowAnchor: 'none',
        }}
      >
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-mb-2w">
          <div className="fr-col-auto">
            <span
              className="fr-icon fr-icon-building-line fr-text--xl"
              style={{ color: 'var(--artwork-major-blue-france)' }}
              aria-hidden
            />
          </div>
          <div className="fr-col">
            <p className="fr-text--sm fr-mb-0">
              <strong>Service émetteur et coordonnées</strong>
            </p>
          </div>
        </div>
        <p className="fr-hint-text fr-mb-2w" style={{ textWrap: 'pretty' }}>
          Ce texte figure en haut à droite du certificat. Vous choisissez <strong>librement</strong> ce qu&apos;il contient :
          par exemple l&apos;intitulé du service qui délivre le document, des coordonnées (téléphone, courriel, horaires),
          ou toute autre mention — <strong>selon ce que vous jugez utile</strong> pour votre commune et ce que vous
          affichez d&apos;habitude sur les documents délivrés en mairie. Rien n&apos;oblige à renseigner tous ces éléments à la
          fois ; vous adaptez le bloc à votre pratique.
        </p>
        <p className="fr-hint-text fr-mb-2w" style={{ textWrap: 'pretty' }}>
          La saisie est toutefois plafonnée à <strong>5 lignes</strong> et <strong>50 caractères par ligne</strong>
          (espaces compris), pour que le texte reste lisible sur le certificat imprimé.
        </p>
        <p className="fr-hint-text fr-mb-2w" style={{ textWrap: 'pretty' }}>
          Si vous ne renseignez pas ce champ, le certificat reprend des <strong>informations par défaut</strong>. Après toute modification, <strong>contrôlez le rendu dans l&apos;aperçu</strong> sous cette
          section : vous restez <strong>responsable du texte</strong> tel qu&apos;il apparaîtra sur le document — vérifiez-le
          avant d&apos;enregistrer en bas de page.
        </p>

        <div className="fr-input-group fr-mb-0" style={{ overflowAnchor: 'none' }}>
          <label className="fr-label fr-mb-1w" htmlFor="certificate-issuer-header-block">
            Texte du bloc (service et coordonnées)
          </label>
          <p className="fr-hint-text fr-mb-1w" style={{ textWrap: 'pretty' }}>
            Touche <strong>Entrée</strong> pour un saut de ligne. Les compteurs sous le champ indiquent la longueur par
            ligne et le total. La partie qui dépasse 50 caractères et ne sera <strong>pas retenue</strong> dans le PDF.
          </p>

          <div
            style={{
              position: 'relative',
              borderRadius: '0.25rem',
              border: '1px solid var(--border-plain-grey)',
              background: disabled
                ? 'var(--background-disabled-grey)'
                : 'var(--background-raised-grey)',
              overflowAnchor: 'none',
            }}
          >
            <pre
              aria-hidden
              style={{
                ...ISSUER_TEXTAREA_SHARED_STYLE,
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                borderRadius: 'inherit',
                margin: 0,
              }}
            >
              {issuerLines.map((line, i) => {
                if (i >= CERTIFICATE_ISSUER_DETAILS_MAX_INPUT_LINES) {
                  return (
                    <Fragment key={i}>
                      {i > 0 ? '\n' : null}
                      <span style={{ color: 'var(--text-default-error)' }}>{line}</span>
                    </Fragment>
                  )
                }
                const maxChars = CERTIFICATE_ISSUER_DETAILS_MAX_CHARS_PER_LOGICAL_LINE
                const ok = line.slice(0, maxChars)
                const over = line.slice(maxChars)
                return (
                  <Fragment key={i}>
                    {i > 0 ? '\n' : null}
                    <span style={{ color: 'var(--text-title-grey)' }}>{ok}</span>
                    {over.length > 0 && (
                      <span style={{ color: 'var(--text-default-error)' }}>{over}</span>
                    )}
                  </Fragment>
                )
              })}
            </pre>

            <textarea
              id="certificate-issuer-header-block"
              rows={8}
              value={issuerHeaderBlockForInput}
              disabled={disabled}
              placeholder={issuerHeaderPlaceholder}
              style={{
                ...ISSUER_TEXTAREA_SHARED_STYLE,
                position: 'relative',
                display: 'block',
                width: '100%',
                minHeight: '12rem',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                ...(hasIssuerText
                  ? {
                      color: 'transparent',
                      WebkitTextFillColor: 'transparent',
                    }
                  : {}),
                caretColor: 'var(--text-title-grey)',
                resize: 'vertical',
                overflowAnchor: 'none',
              }}
              onChange={(e) => {
                onIssuerHeaderBlockInput?.(e.target.value)
              }}
              aria-describedby="certificate-issuer-header-line-counters"
            />
          </div>

          <div
            id="certificate-issuer-header-line-counters"
            className="fr-mt-1w fr-p-2w fr-background-alt--grey"
            style={{
              border: '1px solid var(--border-default-grey)',
              borderRadius: '0.25rem',
              overflowAnchor: 'none',
              contain: 'layout',
              minHeight: '3.5rem',
            }}
          >
            <div
              className="fr-text--xs fr-mb-0 fr-text-mention--grey"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                gap: '0 0.5rem',
                lineHeight: 1.45,
              }}
            >
              <span className="fr-text--bold" style={{ whiteSpace: 'nowrap' }}>Caractères par ligne :</span>
              {lineCharStats.map(({ lineNumber, length, maxLen, over }, i) => (
                <span
                  key={lineNumber}
                  className={over ? undefined : 'fr-text-mention--grey'}
                  style={{
                    color: over ? 'var(--text-default-error)' : undefined,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {i > 0 ? '· ' : ''}
                  L.{lineNumber} {length}/{maxLen}
                </span>
              ))}
              <span className="fr-text-mention--grey" style={{ whiteSpace: 'nowrap' }}>
                — Total {issuerHeaderBlockForInput.length}/{ISSUER_DETAILS_MAX_TOTAL_CHARS}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
