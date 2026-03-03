import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'
import Image from 'next/image'
import { CommuneHeroCard, SectionEditCard } from './DistrictActions/DistrictActions.styles'
import { ConfigSaveStickyBar } from './DistrictActions/ConfigSaveStickyBar'
import language from './DistrictActions/langues-regionales.json'
import { CommuneStatusBadge } from './CommuneStatusBadge'
import { useDistrictConfigSave } from './useDistrictConfigSave'

import { type BANCommune, CertificateTypeEnum, CertificateTypeLabel } from '@/types/api-ban.types'
import { Commune } from '@/types/api-geo.types'
import { type UserInfo } from '@/hooks/useAuth'
import { customFetch } from '@/lib/fetch'
import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'
import { getClientsRecap, type ClientRecapItem, type ClientDepotRaw, type ChefDeFileDepotRaw } from '@/lib/depot-recap'
import { env } from 'next-runtime-env'

const DEFAULT_CODE_LANGUAGE = 'fra'

function formatDate(dateString?: string) {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  catch {
    return 'N/A'
  }
}

const availableLanguage = language
  .filter(lang => lang.code.length === 3)
  .map(lang => ({
    code: lang.code,
    label: lang.label,
    formatedLabel: `${lang.label.charAt(0).toUpperCase()}${lang.label.slice(1)}`,
  })).sort((a, b) => {
    if (a.code === DEFAULT_CODE_LANGUAGE) return -1
    if (b.code === DEFAULT_CODE_LANGUAGE) return 1
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  })

interface DistrictOptionsFormProps {
  district?: BANCommune | null
  commune?: Commune | null
  config: BANCommune['config']
  onUpdateConfig: (config: BANCommune['config']) => void
  readOnly?: boolean
  loading?: boolean
  userInfo?: UserInfo | null
}

const RECAP_TIMEOUT_MS = 15000
const MANDATARY_MODE_ORDER = ['Mes Adresses', 'API Dépôt', 'Moissonneur BAL', 'Formulaire de publication'] as const

function getMandataryDisplayName(
  clientId: string | undefined,
  recap: ClientRecapItem[] | null,
  fallback = 'Mandataire inconnu',
): string {
  if (!clientId) return 'Aucun mandataire sélectionné'
  if (!recap) return 'Mandataire déclaré'
  const item = recap.find(r => r.client_id === clientId)
  if (!item) return fallback
  if (item.mode === item.nom_affichage) return item.mode
  return `${item.mode} – ${item.nom_affichage}`
}

interface MandatarySelectorProps {
  byMode: Record<string, ClientRecapItem[]>
  configState: BANCommune['config']
  config: BANCommune['config']
  selectedMode: string
  setSelectedMode: (mode: string) => void
  enableMandataryChangeWarning: boolean
  hasBanId: boolean | undefined
  recapLoading: boolean
  recapError: string | null
  handleUpdateConfig: (config: BANCommune['config']) => void
}

function MandatarySelector({
  byMode,
  configState,
  config,
  selectedMode,
  setSelectedMode,
  enableMandataryChangeWarning,
  hasBanId,
  recapLoading,
  recapError,
  handleUpdateConfig,
}: MandatarySelectorProps) {
  if (recapLoading) return <p className="fr-hint-text">Chargement des mandataires…</p>
  if (recapError) return <Alert severity="error" description={recapError} small />

  const availableModes = MANDATARY_MODE_ORDER.filter(m => byMode[m]?.length)
  const currentMandatary = enableMandataryChangeWarning ? configState?.mandatary : config?.mandatary
  const currentMode = selectedMode || availableModes[0] || ''
  const apiDepotClients = byMode['API Dépôt'] ?? []
  const isApiDepotMode = currentMode === 'API Dépôt'
  const mustChooseApiDepotClient = isApiDepotMode && apiDepotClients.length > 1 && !currentMandatary

  return (
    <>
      <Select
        label="Type de mandataire"
        hint={(
          <>
            Seuls les organismes adhérents à la{' '}
            <Link href="/communaute/charte-base-adresse-locale">Charte de la Base Adresse Locale</Link>{' '}
            sont éligibles au statut de mandataire.
          </>
        )}
        nativeSelectProps={{
          onChange: (event) => {
            const mode = event.target.value as typeof MANDATARY_MODE_ORDER[number]
            setSelectedMode(mode)
            const clients = byMode[mode] ?? []
            const isApiDepot = mode === 'API Dépôt'
            const nextMandatary = isApiDepot && clients.length > 1 ? '' : clients[0]?.client_id
            handleUpdateConfig({ ...configState, mandatary: nextMandatary })
          },
          value: currentMode,
        }}
        disabled={!enableMandataryChangeWarning || !hasBanId}
      >
        <option value="" disabled hidden>Sélectionnez un type</option>
        {availableModes.map(mode => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </Select>
      {isApiDepotMode && apiDepotClients.length > 0 && (
        <Select
          label="Organisme API Dépôt"
          hint={mustChooseApiDepotClient ? 'Sélection obligatoire pour finaliser le changement de mandataire.' : undefined}
          nativeSelectProps={{
            onChange: (event) => {
              handleUpdateConfig({ ...configState, mandatary: event.target.value })
            },
            value: currentMandatary || '',
          }}
          disabled={!enableMandataryChangeWarning || !hasBanId}
        >
          <option value="" disabled hidden>Sélectionnez un organisme</option>
          {apiDepotClients.map(item => (
            <option key={item.client_id} value={item.client_id}>
              {item.nom_affichage}
            </option>
          ))}
        </Select>
      )}
    </>
  )
}

function DistrictAdmin({ district, commune, config, onUpdateConfig = () => true, readOnly = false, loading = false, userInfo }: DistrictOptionsFormProps) {
  const hasBanId = district?.withBanId
  const isUserAuthorized = district
    && commune?.siren
    && userInfo?.siret
    && userInfo.siret.length >= 9
    && commune.siren === userInfo.siret.substring(0, 9)
  const hasTechnicalRequirements = district && district.nbNumerosCertifies > 0

  const [currentConfig, setCurrentConfig] = useState<string>(JSON.stringify({ ...config }))
  const [configState, setConfigState] = useState<BANCommune['config']>({ ...config })
  const [enableMandataryChange, setEnableMandataryChange] = useState<boolean>(false)
  const [enableMandataryChangeWarning, setEnableMandataryChangeWarning] = useState<boolean>(false)
  const [flagUrl, setFlagUrl] = useState<string>('')
  const [clientsRecap, setClientsRecap] = useState<ClientRecapItem[] | null>(null)
  const [recapLoading, setRecapLoading] = useState<boolean>(true)
  const [recapError, setRecapError] = useState<string | null>(null)
  const recapEffectIdRef = useRef(0)
  const formTopRef = useRef<HTMLDivElement>(null)
  const [selectedMandataryMode, setSelectedMandataryMode] = useState<string>('')
  const [editingSection, setEditingSection] = useState<'certificat' | 'parametrage' | null>(null)

  const clientsByMode = useMemo<Record<string, ClientRecapItem[]>>(() => {
    if (!clientsRecap) return {}
    return clientsRecap.reduce<Record<string, ClientRecapItem[]>>((acc, item) => {
      (acc[item.mode] = acc[item.mode] ?? []).push(item)
      return acc
    }, {})
  }, [clientsRecap])

  const hasUnsavedChanges = JSON.stringify(configState) !== currentConfig

  useEffect(() => {
    const availableModes = MANDATARY_MODE_ORDER.filter(mode => clientsByMode[mode]?.length)
    if (availableModes.length === 0) return
    const activeMandatary = enableMandataryChangeWarning ? configState?.mandatary : config?.mandatary
    const activeItem = activeMandatary
      ? Object.values(clientsByMode).flat().find(item => item.client_id === activeMandatary)
      : null
    const nextMode = activeItem?.mode ?? (selectedMandataryMode || availableModes[0])
    if (nextMode !== selectedMandataryMode) {
      setSelectedMandataryMode(nextMode)
    }
  }, [clientsByMode, config?.mandatary, configState?.mandatary, enableMandataryChangeWarning, selectedMandataryMode])

  useEffect(() => {
    if (config) {
      setConfigState({ ...config })
      setCurrentConfig(JSON.stringify({ ...config }))
    }
  }, [config])

  useEffect(() => {
    let isMounted = true

    if (district?.codeCommune) {
      getCommuneFlagProxy(district.codeCommune).then((url) => {
        if (isMounted) {
          setFlagUrl(url)
        }
      }).catch((error) => {
        console.error('Error fetching flag:', error)
      })
    }

    return () => {
      isMounted = false
    }
  }, [district?.codeCommune])

  useEffect(() => {
    const effectId = recapEffectIdRef.current + 1
    recapEffectIdRef.current = effectId
    let isMounted = true
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const clearRecapTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
    }
    setRecapLoading(true)
    setRecapError(null)
    const apiDepotBase = env('NEXT_PUBLIC_API_DEPOT_URL') || 'https://plateforme-bal.adresse.data.gouv.fr/api-depot'
    const clientsPromise = customFetch(`${apiDepotBase}/clients`) as Promise<ClientDepotRaw[]>
    const chefsPromise = customFetch(`${apiDepotBase}/chefs-de-file`) as Promise<ChefDeFileDepotRaw[]>
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Délai dépassé (${RECAP_TIMEOUT_MS / 1000} s) — vérifiez l’onglet Réseau pour ${apiDepotBase}/clients et /chefs-de-file`))
      }, RECAP_TIMEOUT_MS)
    })
    Promise.race([
      Promise.all([clientsPromise, chefsPromise]),
      timeoutPromise,
    ])
      .then(([clients, chefsDeFile]) => {
        if (!isMounted || recapEffectIdRef.current !== effectId) {
          return
        }
        const recap = getClientsRecap(clients, chefsDeFile)
        setClientsRecap(recap)
      })
      .catch((err) => {
        if (!isMounted || recapEffectIdRef.current !== effectId) return
        setRecapError(err?.message ?? 'Erreur chargement mandataires')
        setClientsRecap(null)
      })
      .finally(() => {
        clearRecapTimeout()
        if (isMounted && recapEffectIdRef.current === effectId) {
          setRecapLoading(false)
        }
      })
    const cleanup = () => {
      isMounted = false
      clearRecapTimeout()
    }
    return cleanup
  }, [])

  const handleUpdateConfig = useCallback((updatedConfig: BANCommune['config']) => {
    setConfigState(updatedConfig)
  }, [])

  const {
    message,
    setMessage,
    isSaving,
    saveProgress,
    pushConfigUpdate,
  } = useDistrictConfigSave({
    district,
    userInfo,
    config,
    configState,
    onUpdateConfig,
    setCurrentConfig,
  })

  const isMandatarySelectionInvalid = enableMandataryChangeWarning
    && selectedMandataryMode === 'API Dépôt'
    && (clientsByMode['API Dépôt']?.length ?? 0) > 1
    && !configState?.mandatary

  if (loading) {
    return (
      <div className="fr-container--fluid">
        <p className="fr-text--sm fr-hint-text fr-mb-0">Chargement des informations de la commune...</p>
      </div>
    )
  }

  if (!district) {
    return (
      <div className="fr-container--fluid">
        <Alert
          severity="info"
          title="Espace Ma commune"
          description="Votre compte n'est pas associé à une commune connue. Cet espace est réservé aux représentants des communes (Mairies)."
        />
      </div>
    )
  }

  return (
    <div ref={formTopRef} className="fr-container--fluid">

      <form>
        <section className="fr-mb-4w">
          {district && (
            <CommuneHeroCard className="fr-mb-3w">
              <Link
                href={`/commune/${district.codeCommune}`}
                className="commune-hero__link"
                aria-label={`Voir la fiche de la commune ${district.nomCommune}`}
              >
                {flagUrl && (
                  <div className="commune-hero__blason">
                    <Image
                      src={flagUrl}
                      loader={({ src }) => src}
                      unoptimized
                      alt=""
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <span className="commune-hero__name">{district.nomCommune}</span>
                <span className="commune-hero__sep">·</span>
                <span className="commune-hero__meta">{district.codeCommune}</span>
                <span className="commune-hero__sep">·</span>
                <span className="commune-hero__meta">{formatDate(district.dateRevision)}</span>
                <span className="commune-hero__sep">·</span>
                <span className="commune-hero__stat">
                  {district ? <CommuneStatusBadge commune={district} /> : '—'}
                </span>
                <span className="commune-hero__stat">
                  <strong>{district.nbVoies.toLocaleString('fr-FR')}</strong> voies
                </span>
                <span className="commune-hero__stat">
                  <strong>{district.nbNumeros.toLocaleString('fr-FR')}</strong> adr.
                </span>
                <span className="commune-hero__stat">
                  <strong>{(district.nbLieuxDits ?? 0).toLocaleString('fr-FR')}</strong> l.-dits
                </span>
                <span className="commune-hero__stat">
                  {district.nbNumeros > 0
                    ? (() => {
                        const taux = Math.round((district.nbNumerosCertifies / district.nbNumeros) * 100)
                        const certLevel = taux >= 80 ? 'high' : taux >= 30 ? 'mid' : 'low'
                        return (
                          <div className="cert-cell">
                            <span className={`cert-cell__label cert-cell__label--${certLevel}`}>
                              {taux}% cert.
                            </span>
                            <div className="cert-bar" role="progressbar" aria-valuenow={taux} aria-valuemin={0} aria-valuemax={100} aria-label={`${taux}% certifiées`}>
                              <div className={`cert-bar__fill cert-bar__fill--${certLevel}`} style={{ width: `${taux}%` }} />
                            </div>
                            <span className="cert-cell__count">
                              {district.nbNumerosCertifies.toLocaleString('fr-FR')} adr.
                            </span>
                          </div>
                        )
                      })()
                    : <strong>0% cert.</strong>}
                </span>
                <span className="commune-hero__cta">
                  Voir la Commune
                  <span className="fr-icon-arrow-right-line fr-icon--sm" aria-hidden="true" />
                </span>
              </Link>
            </CommuneHeroCard>
          )}

          {!hasBanId && (
            <Alert
              severity="warning"
              title="Fonctionnalité indisponible"
              description="Cette commune ne dispose pas encore des identifiants BAN. La certification d'adressage et les options de configuration ne sont pas disponibles."
              small
              className="fr-mb-3w"
            />
          )}

          <SectionEditCard className="fr-mb-3w">
            <div className="sec-card__header">
              <div className="sec-card__header-left">
                <span className="fr-icon fr-icon-file-text-line sec-card__icon" aria-hidden="true" />
                <div>
                  <h3 className="sec-card__title">Certificat d&apos;adressage</h3>
                  <p className="sec-card__value fr-mb-0">
                    <Badge
                      severity={
                        configState?.certificate === CertificateTypeEnum.ALL
                          ? 'success'
                          : configState?.certificate === CertificateTypeEnum.DISTRICT
                            ? 'info'
                            : 'warning'
                      }
                      small
                    >
                      {configState?.certificate === CertificateTypeEnum.DISTRICT
                        ? CertificateTypeLabel[CertificateTypeEnum.DISTRICT]
                        : configState?.certificate === CertificateTypeEnum.ALL
                          ? CertificateTypeLabel[CertificateTypeEnum.ALL]
                          : CertificateTypeLabel[CertificateTypeEnum.DISABLED]}
                    </Badge>
                  </p>
                </div>
              </div>
              {!readOnly && hasBanId && (
                <Button
                  type="button"
                  priority="secondary"
                  iconId={editingSection === 'certificat' ? 'fr-icon-close-line' : 'fr-icon-edit-line'}
                  iconPosition="left"
                  size="small"
                  aria-expanded={editingSection === 'certificat'}
                  aria-controls="sec-certificat-body"
                  onClick={() => setEditingSection(s => s === 'certificat' ? null : 'certificat')}
                >
                  {editingSection === 'certificat' ? 'Fermer' : 'Modifier'}
                </Button>
              )}
            </div>
            {editingSection === 'certificat' && (
              <div id="sec-certificat-body" className="sec-card__body">
                <p className="fr-hint-text fr-mb-1w">Certifiez l&apos;existence d&apos;une adresse sur le territoire de votre commune.</p>
                <p className="fr-text--sm fr-mb-3w">À noter : l&apos;émission d&apos;un certificat d&apos;adressage n&apos;est possible que pour les adresses certifiées et rattachées à une parcelle.</p>
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
              </div>
            )}
          </SectionEditCard>

          <SectionEditCard className="fr-mb-3w">
            <div className="sec-card__header">
              <div className="sec-card__header-left">
                <span className="fr-icon fr-icon-settings-5-line sec-card__icon" aria-hidden="true" />
                <div>
                  <h3 className="sec-card__title">Paramètres des fichiers BAL</h3>
                  <p className="sec-card__value fr-mb-0">
                    Langue&nbsp;principale:&nbsp;
                    <strong>
                      {availableLanguage.find(l => l.code === (configState?.defaultBalLang || DEFAULT_CODE_LANGUAGE))?.formatedLabel ?? 'Français'}
                    </strong>
                    {' · '}Redressement odonymes&nbsp;: <strong>Activé</strong>
                    {' · '}Communes anciennes&nbsp;: <strong>Activé</strong>
                  </p>
                </div>
              </div>
              {!readOnly && hasBanId && (
                <Button
                  type="button"
                  priority="secondary"
                  iconId={editingSection === 'parametrage' ? 'fr-icon-close-line' : 'fr-icon-edit-line'}
                  iconPosition="left"
                  size="small"
                  aria-expanded={editingSection === 'parametrage'}
                  aria-controls="sec-parametrage-body"
                  onClick={() => setEditingSection(s => s === 'parametrage' ? null : 'parametrage')}
                >
                  {editingSection === 'parametrage' ? 'Fermer' : 'Modifier'}
                </Button>
              )}
            </div>
            {editingSection === 'parametrage' && (
              <div id="sec-parametrage-body" className="sec-card__body">
                <p className="fr-hint-text fr-mb-3w">Indiquez à la BAN les options de traitement spécifiques aux fichiers BAL de votre commune.</p>
                <Select
                  label="Langue par défaut des odonymes"
                  hint="Langue par défaut des odonymes fournis dans le fichier BAL sur les champs 'toponyme' (BAL 1.5) ou 'voie_nom' (BAL 1.4)."
                  disabled={!hasBanId}
                  nativeSelectProps={{
                    onChange: event => handleUpdateConfig({ ...configState, defaultBalLang: event.target.value }),
                    value: configState?.defaultBalLang || DEFAULT_CODE_LANGUAGE,
                    disabled: !hasBanId,
                  }}
                >
                  <option value="" disabled hidden>Sélectionnez une langue</option>
                  {availableLanguage.map(lang => (
                    <option key={lang.code} value={lang.code} style={{ textTransform: 'capitalize' }}>
                      {lang.formatedLabel}
                    </option>
                  ))}
                </Select>
                <ToggleSwitch
                  label="Redressement automatique des odonymes"
                  helperText="Corrige les odonymes pour respecter les règles typographiques recommandées par le Standard Adresse."
                  checked={true}
                  showCheckedHint={false}
                  labelPosition="left"
                  disabled={true}
                  onChange={() => {}}
                />
                <ToggleSwitch
                  label="Calcul automatique des communes anciennes"
                  helperText="Ajoute aux adresses l'information de la commune ancienne (cette information peut permettre de distinguer les possibles doublons de voies ou adresses)."
                  checked={true}
                  showCheckedHint={false}
                  labelPosition="left"
                  disabled={true}
                  onChange={() => {}}
                />
              </div>
            )}
          </SectionEditCard>

          <SectionEditCard id="ma-commune-delegation" className="fr-mb-3w">
            <div className="sec-card__header">
              <div className="sec-card__header-left">
                <span className="fr-icon fr-icon-team-line sec-card__icon" aria-hidden="true" />
                <div>
                  <h3 className="sec-card__title">Délégation</h3>
                  <p className="sec-card__value fr-mb-0">
                    Autorisez un mandataire à publier les adresses BAL de votre commune.
                  </p>
                </div>
              </div>
            </div>
            <div className="sec-card__body">
              <div className="mandatary-row fr-mb-3w">
                <span className="fr-icon fr-icon-user-line mandatary-row__icon" aria-hidden="true" />
                <div className="mandatary-row__info">
                  <span className="mandatary-row__label">Source actuelle de publication</span>
                  <span className="mandatary-row__name">
                    {recapLoading
                      ? '…'
                      : recapError
                        ? 'Indisponible'
                        : getMandataryDisplayName(config?.mandatary ?? configState?.mandatary, clientsRecap)}
                  </span>
                </div>
                {!enableMandataryChange && !readOnly && (
                  <Button
                    type="button"
                    priority="secondary"
                    iconId="fr-icon-edit-line"
                    iconPosition="left"
                    size="small"
                    disabled={!hasBanId}
                    onClick={() => setEnableMandataryChange(true)}
                  >
                    Modifier
                  </Button>
                )}
              </div>

              {enableMandataryChange && (
                <>
                  <hr className="fr-hr mandatary-edit-sep" />
                  <Alert
                    severity="info"
                    title="Attention"
                    description="En cas de changement de délégation  de publication, pour assurer la cohérence de la donnée, merci de vous assurer avec le nouveau mandataire d'être bien reparti de la version précédente de la BAL, dont une copie est disponible sur  la page commune (fichier Format Local - BAL)."
                    small
                    className="fr-mb-2w"
                  />
                  <Checkbox
                    options={[{
                      label: 'J\'ai compris les risques associés au changement de mandataire pour ma commune.',
                      nativeInputProps: {
                        name: 'checkboxes-1',
                        value: 'understood-mandatary-change-warning',
                        checked: enableMandataryChangeWarning,
                        onChange: (checkbox) => {
                          if (checkbox.target.checked) {
                            setEnableMandataryChangeWarning(true)
                          }
                          else {
                            setConfigState({ ...configState, mandatary: config?.mandatary })
                            setEnableMandataryChangeWarning(false)
                          }
                        },
                      },
                    }]}
                    state="default"
                  />
                  {!readOnly && (
                    <MandatarySelector
                      byMode={clientsByMode}
                      configState={configState}
                      config={config}
                      selectedMode={selectedMandataryMode}
                      setSelectedMode={setSelectedMandataryMode}
                      enableMandataryChangeWarning={enableMandataryChangeWarning}
                      hasBanId={hasBanId}
                      recapLoading={recapLoading}
                      recapError={recapError}
                      handleUpdateConfig={handleUpdateConfig}
                    />
                  )}
                  <div className="mandatary-edit-actions">
                    <Button
                      type="button"
                      priority="secondary"
                      iconId="fr-icon-close-line"
                      onClick={() => {
                        setConfigState({ ...configState, mandatary: config?.mandatary })
                        setEnableMandataryChangeWarning(false)
                        setEnableMandataryChange(false)
                      }}
                      size="small"
                    >
                      Annuler & conserver mon mandataire actuel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </SectionEditCard>
        </section>

        {!readOnly && (
          <ConfigSaveStickyBar
            hasUnsavedChanges={hasUnsavedChanges}
            onReset={() => handleUpdateConfig({ ...config })}
            message={message}
            setMessage={setMessage}
            isSaving={isSaving}
            saveProgress={saveProgress}
            onSave={pushConfigUpdate}
            saveDisabled={isMandatarySelectionInvalid}
            saveDisabledAriaLabel="Enregistrer les modifications (sélectionnez d'abord un mandataire)"
          />
        )}
      </form>
    </div>
  )
}

export default DistrictAdmin
