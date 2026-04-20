'use client'

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Tabs } from '@codegouvfr/react-dsfr/Tabs'
import { CertificatePdfCustomizationFields } from './CertificatePdfCustomizationFields'
import { CertificatePdfPreviewButtonClean } from './CertificatePdfPreviewButtonClean'
import {
  getDefaultAttestationTemplate,
  resetCertificatePresentationToServiceDefaults,
} from '@/lib/certificate-issuer-config'
import { type BANConfig, CertificateTypeEnum, CertificateTypeLabel } from '@/types/api-ban.types'

export type CertificatePdfUiPhase = 'preview-only' | 'customize'

export type CertificateContentStep = 'customize-logo' | 'customize-service'

type CertificateAdminPanelProps = {
  configState: BANConfig | undefined
  handleUpdateConfig: (c: BANConfig) => void
  readOnly: boolean
  isUserAuthorized: boolean
  hasTechnicalRequirements: boolean
  hasBanId: boolean
  codeCommune: string | undefined
  nomCommune: string | undefined
  communePopulation?: number
  certificatePdfUiPhase: CertificatePdfUiPhase
  setCertificatePdfUiPhase: Dispatch<SetStateAction<CertificatePdfUiPhase>>
  certificateContentStep: CertificateContentStep
  setCertificateContentStep: Dispatch<SetStateAction<CertificateContentStep>>
  issuerHeaderBlockForInput: string
  issuerDetailsDefaultHint?: string
  onIssuerHeaderBlockInput: (raw: string) => void
  onCertificatePdfPreviewDisplayed?: () => void
}

export function CertificateAdminPanel({
  configState,
  handleUpdateConfig,
  readOnly,
  isUserAuthorized,
  hasTechnicalRequirements,
  hasBanId,
  codeCommune,
  nomCommune,
  communePopulation,
  certificatePdfUiPhase,
  setCertificatePdfUiPhase,
  certificateContentStep,
  setCertificateContentStep,
  issuerHeaderBlockForInput,
  issuerDetailsDefaultHint,
  onIssuerHeaderBlockInput,
  onCertificatePdfPreviewDisplayed,
}: CertificateAdminPanelProps) {
  const certIsEnabled = Boolean(configState?.certificate && configState.certificate !== CertificateTypeEnum.DISABLED)
  const certPdfPreviewAnchorRef = useRef<HTMLDivElement>(null)
  const pendingScrollToPdfPreviewRef = useRef(false)

  useLayoutEffect(() => {
    if (certificatePdfUiPhase !== 'customize' || !pendingScrollToPdfPreviewRef.current) {
      return
    }
    pendingScrollToPdfPreviewRef.current = false
    const t = window.setTimeout(() => {
      certPdfPreviewAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => window.clearTimeout(t)
  }, [certificatePdfUiPhase])

  const handleResetPresentationDefaults = useCallback(() => {
    if (!configState) return
    handleUpdateConfig(resetCertificatePresentationToServiceDefaults(configState))
  }, [configState, handleUpdateConfig])

  const pdfPreviewProps = useMemo(() => {
    if (!codeCommune) return null
    return {
      codeCommune,
      nomCommune: nomCommune ?? '',
      certificateShowLogo: configState?.certificateShowLogo ?? false,
      certificateIssuerDetails: issuerHeaderBlockForInput,
      certificateAttestationText:
        configState?.certificateAttestationText ?? getDefaultAttestationTemplate(communePopulation),
      disabled: readOnly || !isUserAuthorized || !hasBanId,
    }
  }, [
    codeCommune,
    nomCommune,
    communePopulation,
    configState?.certificateAttestationText,
    configState?.certificateShowLogo,
    issuerHeaderBlockForInput,
    hasBanId,
    isUserAuthorized,
    readOnly,
  ])

  const renderPdfPreviewButton = (triggerPriority: 'primary' | 'secondary') =>
    pdfPreviewProps
      ? (
          <CertificatePdfPreviewButtonClean
            {...pdfPreviewProps}
            triggerPriority={triggerPriority}
            onPdfDisplayed={onCertificatePdfPreviewDisplayed}
          />
        )
      : null

  return (
    <>
      <section aria-labelledby="cert-admin-access-title" className="fr-mb-0">
        <h4 id="cert-admin-access-title" className="fr-h4 fr-mb-2w">
          Accès au téléchargement
        </h4>
        <p className="fr-hint-text fr-mb-2w">
          Choisissez qui peut obtenir un certificat depuis adresse.data.gouv.fr. Le document attesté n’est délivré que pour les adresses déjà certifiées et rattachées à une parcelle cadastrale.
        </p>
        {!isUserAuthorized && (
          <Alert
            severity="warning"
            title="Activation impossible"
            description="Votre compte ne semble pas rattaché à cette commune (SIREN différent). Vous ne pouvez pas activer la certification."
            small
            className="fr-mb-2w"
          />
        )}
        {!hasTechnicalRequirements && isUserAuthorized && (
          <Alert
            severity="warning"
            title="Conditions techniques non remplies"
            description="Cette commune ne dispose pas d'adresses certifiées. L'émission de certificats est impossible."
            small
            className="fr-mb-2w"
          />
        )}
        <RadioButtons
          legend="Niveau d'accès aux certificats"
          name="certification-type"
          options={[
            {
              label: CertificateTypeLabel[CertificateTypeEnum.DISABLED],
              hintText: `Les certificats d'adressage ne sont pas disponibles pour cette commune depuis le site adresse.data.gouv.fr.`,
              nativeInputProps: {
                value: CertificateTypeEnum.DISABLED,
                checked: configState?.certificate === CertificateTypeEnum.DISABLED || !configState?.certificate,
                onChange: () => handleUpdateConfig({ ...configState, certificate: CertificateTypeEnum.DISABLED }),
                disabled: !isUserAuthorized || !hasBanId,
              },
            },
            {
              label: CertificateTypeLabel[CertificateTypeEnum.DISTRICT],
              hintText: `Les certificats seront téléchargeables depuis le site adresse.data.gouv.fr par toute personne connectée avec une adresse e-mail rattachée à la mairie de la commune.`,
              nativeInputProps: {
                value: CertificateTypeEnum.DISTRICT,
                checked: configState?.certificate === CertificateTypeEnum.DISTRICT,
                onChange: () => handleUpdateConfig({ ...configState, certificate: CertificateTypeEnum.DISTRICT }),
                disabled: !isUserAuthorized || !hasTechnicalRequirements || !hasBanId,
              },
            },
            {
              label: CertificateTypeLabel[CertificateTypeEnum.ALL],
              hintText: `Les certificats sont librement téléchargeables depuis le site adresse.data.gouv.fr par tous.`,
              nativeInputProps: {
                value: CertificateTypeEnum.ALL,
                checked: configState?.certificate === CertificateTypeEnum.ALL,
                onChange: () => handleUpdateConfig({ ...configState, certificate: CertificateTypeEnum.ALL }),
                disabled: !isUserAuthorized || !hasTechnicalRequirements || !hasBanId,
              },
            },
          ]}
        />

        {!certIsEnabled && (
          <p className="fr-hint-text fr-mt-3w fr-mb-0">
            L&apos;aperçu et la personnalisation du certificat apparaissent lorsque vous activez un accès au téléchargement.
          </p>
        )}
      </section>

      {certIsEnabled && (
        <>
          <hr className="fr-hr fr-mt-4w fr-mb-0" />
          <section
            aria-labelledby="cert-admin-pdf-title"
            className="fr-pt-4w"
          >
            <h4 id="cert-admin-pdf-title" className="fr-h4 fr-mb-1w">
              Présentation du certificat
            </h4>
            <p className="fr-hint-text fr-mb-3w">
              Adaptez l&apos;apparence du certificat d&apos;adressage tel qu&apos;il sera téléchargé par les usagers (fichier PDF). Aucune modification n&apos;est enregistrée dans la Base Adresse Nationale tant que vous n&apos;avez pas cliqué sur « Enregistrer les modifications » en bas de page.
            </p>

            {certificatePdfUiPhase === 'preview-only' && (
              <div
                className="fr-p-3w"
                style={{
                  border: '1px solid var(--blue-france-850-200)',
                  borderLeftWidth: '0.25rem',
                  borderLeftColor: 'var(--blue-france-sun-113-625)',
                  borderRadius: '0.25rem',
                  background: 'var(--blue-france-975-75)',
                }}
              >
                <p className="fr-text--sm fr-mb-2w" style={{ textWrap: 'pretty' }}>
                  Cet aperçu montre le certificat avec les valeurs par défaut ou celles que vous avez déjà renseignées. Si le rendu vous convient, enregistrez la configuration. Sinon, poursuivez avec la personnalisation (emblème communal et service) ci-dessous.
                </p>
                <div className="fr-mt-1w">{renderPdfPreviewButton('primary')}</div>

                <div
                  className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-my-3w fr-text--sm fr-hint-text"
                  style={{ maxWidth: '36rem' }}
                  aria-hidden
                >
                  <div className="fr-col">
                    <hr className="fr-hr fr-mb-0" />
                  </div>
                  <div className="fr-col-auto fr-px-1w">ou bien</div>
                  <div className="fr-col">
                    <hr className="fr-hr fr-mb-0" />
                  </div>
                </div>

                <div>
                  <p className="fr-text--sm fr-mb-2w fr-text--bold">
                    Modifier le contenu
                  </p>
                  <Button
                    type="button"
                    priority="secondary"
                    iconId="fr-icon-edit-line"
                    disabled={readOnly || !isUserAuthorized || !hasBanId}
                    onClick={() => {
                      pendingScrollToPdfPreviewRef.current = true
                      setCertificatePdfUiPhase('customize')
                    }}
                  >
                    Modifier le contenu du certificat
                  </Button>
                </div>
              </div>
            )}

            {certificatePdfUiPhase === 'customize' && (
              <>
                <div>
                  <div className="fr-mb-3w fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
                    <div className="fr-col">
                      <Button
                        type="button"
                        priority="tertiary"
                        size="small"
                        iconId="fr-icon-arrow-left-line"
                        onClick={() => setCertificatePdfUiPhase('preview-only')}
                      >
                        Revenir à l&apos;aperçu seul
                      </Button>
                    </div>
                    <div className="fr-col" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="button"
                        priority="tertiary"
                        size="small"
                        iconId="fr-icon-refresh-line"
                        disabled={readOnly || !isUserAuthorized || !hasBanId}
                        onClick={handleResetPresentationDefaults}
                      >
                        Réinitialiser aux valeurs par défaut
                      </Button>
                    </div>
                  </div>
                  <div className="fr-text--xs fr-hint-text fr-mb-3w">
                    <p className="fr-mb-1w">
                      Les onglets ci-dessous servent à personnaliser deux éléments du certificat PDF :
                    </p>
                    <ul className="fr-mb-1w fr-pl-3w fr-mt-0">
                      <li className="fr-mb-0w">
                        <strong>Emblème communal</strong>
                        {' '}
                        — afficher ou non le visuel officiel de la commune (en haut à droite du document).
                      </li>
                      <li className="fr-mb-0">
                        <strong>Service émetteur et coordonnées</strong>
                        {' '}
                        — texte libre en haut à gauche (service, coordonnées, etc., selon votre choix ; jusqu&apos;à 5
                        lignes).
                      </li>
                    </ul>
                    <p className="fr-mb-1w fr-text--xs fr-text-mention--grey">
                      Le bouton « Réinitialiser aux valeurs par défaut » annule vos changements sur cette présentation et
                      revient à l’affichage obtenu au premier chargement de la page.
                    </p>
                    <p className="fr-mb-0 fr-text--xs fr-text-mention--grey">
                      <strong>Pour valider :</strong>
                      {' '}
                      ouvrez l&apos;aperçu PDF un peu plus bas, vérifiez le rendu, puis utilisez « Enregistrer les
                      modifications » en bas de page afin d&apos;envoyer la configuration à la Base Adresse Nationale.
                    </p>
                  </div>

                  <div className="fr-mb-0" style={{ scrollMarginTop: '0.5rem', overflowAnchor: 'none' }}>
                    <Tabs
                      id="certificat-pdf-tabs"
                      label="Contenu du certificat"
                      selectedTabId={certificateContentStep}
                      onTabChange={tabId => setCertificateContentStep(tabId as CertificateContentStep)}
                      tabs={[
                        { tabId: 'customize-logo', label: 'Emblème communal', iconId: 'fr-icon-image-line' },
                        { tabId: 'customize-service', label: 'Service et coordonnées', iconId: 'fr-icon-building-line' },
                      ]}
                    >
                      {certificateContentStep === 'customize-logo' && (
                        <div
                          className="fr-mb-0"
                          style={{
                            minHeight: 'min(70vh, 56rem)',
                            boxSizing: 'border-box',
                            overflowAnchor: 'none',
                          }}
                        >
                          <CertificatePdfCustomizationFields
                            variant="logo"
                            configState={configState}
                            handleUpdateConfig={handleUpdateConfig}
                            readOnly={readOnly}
                            isUserAuthorized={Boolean(isUserAuthorized)}
                            hasBanId={Boolean(hasBanId)}
                            nomCommune={nomCommune}
                            defaultAttestationTemplate={getDefaultAttestationTemplate(communePopulation)}
                          />
                        </div>
                      )}
                      {certificateContentStep === 'customize-service' && (
                        <div
                          className="fr-mb-0"
                          style={{
                            minHeight: 'min(70vh, 56rem)',
                            boxSizing: 'border-box',
                            overflowAnchor: 'none',
                          }}
                        >
                          <CertificatePdfCustomizationFields
                            variant="service"
                            configState={configState}
                            handleUpdateConfig={handleUpdateConfig}
                            readOnly={readOnly}
                            isUserAuthorized={Boolean(isUserAuthorized)}
                            hasBanId={Boolean(hasBanId)}
                            nomCommune={nomCommune}
                            defaultAttestationTemplate={getDefaultAttestationTemplate(communePopulation)}
                            issuerHeaderBlockForInput={issuerHeaderBlockForInput}
                            issuerDetailsDefaultHint={issuerDetailsDefaultHint}
                            communePopulation={communePopulation}
                            onIssuerHeaderBlockInput={onIssuerHeaderBlockInput}
                          />
                        </div>
                      )}
                    </Tabs>
                  </div>
                </div>

                <hr className="fr-hr fr-mt-4w fr-mb-0" />
                <div
                  ref={certPdfPreviewAnchorRef}
                  className="fr-pt-4w"
                  style={{
                    scrollMarginTop: '5rem',
                    overflowAnchor: 'none',
                  }}
                  aria-labelledby="cert-pdf-preview-title"
                >
                  <p id="cert-pdf-preview-title" className="fr-text--xs fr-mb-1w fr-text--bold">
                    Aperçu du certificat
                  </p>
                  <p className="fr-text--xs fr-hint-text fr-mb-2w">
                    Le PDF affiché correspond à vos réglages actuels (onglets ci-dessus). Rouvrez l&apos;aperçu après une
                    modification si besoin.
                  </p>
                  <div className="fr-mt-1w">{renderPdfPreviewButton('secondary')}</div>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </>
  )
}
