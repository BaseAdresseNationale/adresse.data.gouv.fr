import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { RadioButtons } from '@codegouvfr/react-dsfr/RadioButtons'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import { Tag } from '@codegouvfr/react-dsfr/Tag'
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
import CommuneLogo, { COMMUNE_LOGO_SIZE_SMALL } from '@/components/CommuneLogo/CommuneLogo'
import Loader from '@/components/Loader'
import { customFetch } from '@/lib/fetch'
import { getClientsRecap, type ClientRecapItem, type ClientDepotRaw, type ChefDeFileDepotRaw } from '@/lib/depot-recap'
import { getRevisions } from '@/lib/api-depot'
import type { Revision } from '@/types/api-depot.types'
import { getDataset } from '@/lib/api-data-gouv'
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

const availableLanguage = (language as { code: string, label: string }[])
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

/** Codes des langues ayant un drapeau dans /public/img/flags (nom fichier = code.svg) */
const LANG_CODES_WITH_FLAG = new Set(availableLanguage.map(l => l.code))

const BAL_PARAMS_HINTS = {
  langue: 'Langue principale des noms de voies et lieux-dits dans le fichier BAL (champs toponyme / voie_nom).',
  langueRegionale: 'Langue alternative des noms de voies et lieux-dits  dans le fichier BAL (champs nom_voie_alt / toponyme_alt).',
  redressement: 'Harmonise les libellés des odonymes (voies et lieux-dits) selon les règles typographiques (casse, accents, etc.).',
  communesAnciennes: 'Le nom des communes historiques est ajouté aux adresses.',
} as const

function BalParamsSummary({
  defaultBalLang,
  availableLanguage: langs,
  altLangCodes = [],
  redressementOdonymes,
  communesAnciennes,
}: {
  defaultBalLang: string
  availableLanguage: typeof availableLanguage
  altLangCodes?: string[]
  redressementOdonymes: boolean
  communesAnciennes: boolean
}) {
  const currentLang = langs.find(l => l.code === defaultBalLang) ?? { code: DEFAULT_CODE_LANGUAGE, formatedLabel: 'Français' }
  const flagSrc = LANG_CODES_WITH_FLAG.has(currentLang.code) ? `/img/flags/${currentLang.code}.svg` : '/img/flags/fra.svg'
  const altLangsWithLabel = altLangCodes
    .map((code) => {
      const lang = langs.find(l => l.code === code)
      return lang ? { code: lang.code, formatedLabel: lang.formatedLabel } : null
    })
    .filter((l): l is { code: string, formatedLabel: string } => Boolean(l))

  return (
    <div className="sec-card__value bal-params-summary fr-mb-0">
      <div className="bal-params-summary__row">
        <div className="bal-params-summary__label-line">
          <span className="fr-icon fr-icon-global-line bal-params-summary__row-icon" aria-hidden="true" />
          <span className="bal-params-summary__label">Langue principale</span>
          <Tag
            nativeSpanProps={{
              className: 'fr-tag--blue-cumulus',
              title: 'Langue principale des odonymes',
            }}
          >
            <Image
              src={flagSrc}
              alt=""
              width={16}
              height={12}
              className="bal-params-summary__tag-flag"
            />
            <span>{currentLang.formatedLabel}</span>
          </Tag>
        </div>
        <p className="fr-hint-text bal-params-summary__hint">{BAL_PARAMS_HINTS.langue}</p>
      </div>

      {altLangsWithLabel.length > 0 && (
        <div className="bal-params-summary__row">
          <div className="bal-params-summary__label-line">
            <span className="fr-icon fr-icon-global-line bal-params-summary__row-icon" aria-hidden="true" />
            <span className="bal-params-summary__label">Langue(s) alternative(s)</span>
            {altLangsWithLabel.map(({ code, formatedLabel }) => {
              const flagSrc = LANG_CODES_WITH_FLAG.has(code) ? `/img/flags/${code}.svg` : '/img/flags/fra.svg'
              return (
                <Tag
                  key={code}
                  nativeSpanProps={{
                    className: 'fr-tag--blue-cumulus',
                    title: `Odonymes en ${formatedLabel}`,
                  }}
                >
                  <Image
                    src={flagSrc}
                    alt=""
                    width={16}
                    height={12}
                    className="bal-params-summary__tag-flag"
                  />
                  <span>{formatedLabel}</span>
                </Tag>
              )
            })}
          </div>
          <p className="fr-hint-text bal-params-summary__hint">{BAL_PARAMS_HINTS.langueRegionale}</p>
        </div>
      )}

      <div className="bal-params-summary__row">
        <div className="bal-params-summary__label-line">
          <span className="fr-icon fr-icon-font-size bal-params-summary__row-icon" aria-hidden="true" />
          <span className="bal-params-summary__label">Harmonisation des odonymes</span>
          <Tag
            nativeSpanProps={{
              title: 'Redressement automatique des odonymes',
            }}
          >
            {redressementOdonymes ? 'Activé par défaut' : 'Désactivé'}
          </Tag>
        </div>
        <p className="fr-hint-text bal-params-summary__hint">{BAL_PARAMS_HINTS.redressement}</p>
      </div>

      <div className="bal-params-summary__row">
        <div className="bal-params-summary__label-line">
          <span className="fr-icon fr-icon-building-line bal-params-summary__row-icon" aria-hidden="true" />
          <span className="bal-params-summary__label">Communes historiques</span>
          <Tag
            nativeSpanProps={{
              title: 'Calcul automatique des communes anciennes',
            }}
          >
            {communesAnciennes ? 'Activé par défaut' : 'Désactivé'}
          </Tag>
        </div>
        <p className="fr-hint-text bal-params-summary__hint">{BAL_PARAMS_HINTS.communesAnciennes}</p>
      </div>
    </div>
  )
}

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

function getSourceDisplayFromMap(
  clientId: string | undefined,
  clientIdToDisplay: Record<string, { mode: string, source: string }>,
): { mode: string, source: string } {
  if (!clientId) return { mode: '—', source: '—' }
  const d = clientIdToDisplay[clientId]
  return d ?? { mode: '—', source: '—' }
}

function getUniqueClientIdsFromRevisions(revisions: Revision[]): string[] {
  const seen = new Set<string>()
  return revisions
    .filter(r => r?.client?.id)
    .map(r => r.client.id)
    .filter((id) => {
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
}

function getModeAndSourceFromRevision(
  r: Revision,
  nomCommune: string | undefined,
  organizationNamesBySourceId: Record<string, string>,
): { mode: string, source: string } {
  if (r?.context?.extras?.sourceId) {
    const sourceId = r.context.extras.sourceId
    return {
      mode: 'Moissonneur',
      source: organizationNamesBySourceId[sourceId] ?? r.client?.nom ?? '-',
    }
  }
  if (r?.context?.extras?.balId) {
    return {
      mode: 'Mes Adresses',
      source: nomCommune ? `Commune de ${nomCommune}` : '-',
    }
  }
  return {
    mode: 'API Dépôt',
    source: r.client?.nom ?? '-',
  }
}

interface SourceSelectorProps {
  sourceOptions: { clientId: string, label: string }[]
  effectiveClientId: string | undefined
  configState: BANCommune['config']
  enableMandataryChangeWarning: boolean
  hasBanId: boolean | undefined
  revisionsLoading: boolean
  revisionsError: string | null
  handleUpdateConfig: (config: BANCommune['config']) => void
}

function SourceSelector({
  sourceOptions,
  effectiveClientId,
  configState,
  enableMandataryChangeWarning,
  hasBanId,
  revisionsLoading,
  revisionsError,
  handleUpdateConfig,
}: SourceSelectorProps) {
  const currentClientId = enableMandataryChangeWarning ? configState?.mandatary : effectiveClientId

  if (revisionsLoading) return <p className="fr-hint-text">Chargement des publications…</p>
  if (revisionsError) return <Alert severity="error" description={revisionsError} small />
  if (sourceOptions.length === 0) {
    return <p className="fr-hint-text">Aucune publication passée pour cette commune.</p>
  }

  return (
    <Select
      label="Changer la source"
      hint={(
        <>
          Seuls les organismes adhérents à la{' '}
          <Link href="/communaute/charte-base-adresse-locale">Charte de la Base Adresse Locale</Link>{' '}
          sont éligibles au statut de source de publication.
        </>
      )}
      nativeSelectProps={{
        onChange: (event) => {
          handleUpdateConfig({ ...configState, mandatary: event.target.value })
        },
        value: currentClientId || sourceOptions[0]?.clientId || '',
      }}
      disabled={!enableMandataryChangeWarning || !hasBanId}
    >
      <option value="" disabled hidden>Sélectionnez une source</option>
      {sourceOptions.map(opt => (
        <option key={opt.clientId} value={opt.clientId}>
          {opt.label}
        </option>
      ))}
    </Select>
  )
}

function DistrictAdmin({ district, commune, config, onUpdateConfig = () => true, readOnly = false, loading = false, userInfo }: DistrictOptionsFormProps) {
  const hasBanId = district?.withBanId
  const isAssemblage = district?.typeComposition === 'assemblage'
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
  const [clientsRecap, setClientsRecap] = useState<ClientRecapItem[] | null>(null)
  const [recapLoading, setRecapLoading] = useState<boolean>(true)
  const [recapError, setRecapError] = useState<string | null>(null)
  const [communeRevisions, setCommuneRevisions] = useState<Revision[] | null>(null)
  const [revisionsLoading, setRevisionsLoading] = useState<boolean>(true)
  const [revisionsError, setRevisionsError] = useState<string | null>(null)
  const [organizationNamesBySourceId, setOrganizationNamesBySourceId] = useState<Record<string, string>>({})
  const recapEffectIdRef = useRef(0)
  const formTopRef = useRef<HTMLDivElement>(null)
  const [editingSection, setEditingSection] = useState<'certificat' | 'parametrage' | null>(null)

  const hasUnsavedChanges = JSON.stringify(configState) !== currentConfig

  const clientIdToDisplay = useMemo<Record<string, { mode: string, source: string }>>(() => {
    if (!communeRevisions?.length) return {}
    const uniqueIds = getUniqueClientIdsFromRevisions(communeRevisions)
    const result: Record<string, { mode: string, source: string }> = {}
    for (const clientId of uniqueIds) {
      const rev = communeRevisions.find(r => r?.client?.id === clientId)
      if (rev) {
        result[clientId] = getModeAndSourceFromRevision(rev, district?.nomCommune, organizationNamesBySourceId)
      }
    }
    return result
  }, [communeRevisions, district?.nomCommune, organizationNamesBySourceId])

  const sourceOptions = useMemo<{ clientId: string, label: string }[]>(() => {
    if (!communeRevisions?.length) return []
    const uniqueIds = getUniqueClientIdsFromRevisions(communeRevisions)
    return uniqueIds.map((clientId) => {
      const d = clientIdToDisplay[clientId]
      return { clientId, label: d?.source ?? 'Source inconnue' }
    })
  }, [communeRevisions, clientIdToDisplay])

  const effectiveClientId = useMemo(() => {
    const stored = configState?.mandatary ?? config?.mandatary
    if (stored) return stored
    const lastRevision = communeRevisions?.[0]
    return lastRevision?.client?.id
  }, [config?.mandatary, configState?.mandatary, communeRevisions])

  const altLangCodes = useMemo<string[]>(() => {
    if (!district?.voies?.length) return []
    const codes = new Set<string>()
    for (const voie of district.voies) {
      if (!voie.nomVoieAlt || typeof voie.nomVoieAlt !== 'object') continue
      for (const code of Object.keys(voie.nomVoieAlt)) {
        if (code) codes.add(code)
      }
    }
    return Array.from(codes)
  }, [district?.voies])

  const LAST_N_REVISIONS_FOR_SENSIBILISATION = 10
  const multipleProducersInRecentRevisions = useMemo(() => {
    if (!communeRevisions?.length) return { active: false, count: 0 }
    const recent = communeRevisions.slice(0, LAST_N_REVISIONS_FOR_SENSIBILISATION)
    const clientIds = new Set(recent.map(r => r?.client?.id).filter(Boolean))
    const count = clientIds.size
    return { active: count >= 2, count }
  }, [communeRevisions])

  useEffect(() => {
    if (config) {
      setConfigState({ ...config })
      setCurrentConfig(JSON.stringify({ ...config }))
    }
  }, [config])

  useEffect(() => {
    let isMounted = true
    if (!district?.codeCommune) {
      setCommuneRevisions(null)
      setRevisionsLoading(false)
      setRevisionsError(null)
      return
    }
    setRevisionsLoading(true)
    setRevisionsError(null)
    getRevisions(district.codeCommune)
      .then((revisions) => {
        if (isMounted) setCommuneRevisions(revisions)
      })
      .catch((err) => {
        if (isMounted) {
          setRevisionsError(err?.message ?? 'Erreur chargement des publications')
          setCommuneRevisions(null)
        }
      })
      .finally(() => {
        if (isMounted) setRevisionsLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [district?.codeCommune])

  useEffect(() => {
    if (!communeRevisions?.length) {
      setOrganizationNamesBySourceId({})
      return
    }
    const sourceIds = [...new Set(
      communeRevisions
        .map(r => r?.context?.extras?.sourceId)
        .filter((id): id is string => Boolean(id)),
    )]
    if (sourceIds.length === 0) {
      setOrganizationNamesBySourceId({})
      return
    }
    let isMounted = true
    Promise.all(
      sourceIds.map(async (sourceId) => {
        try {
          const dataset = await getDataset(sourceId)
          return { sourceId, name: (dataset as { organization?: { name?: string } })?.organization?.name ?? '' }
        }
        catch {
          return { sourceId, name: '' }
        }
      }),
    ).then((results) => {
      if (!isMounted) return
      const map = results.reduce<Record<string, string>>((acc, { sourceId, name }) => {
        if (name) acc[sourceId] = name
        return acc
      }, {})
      setOrganizationNamesBySourceId(map)
    })
    return () => {
      isMounted = false
    }
  }, [communeRevisions])

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
    onSuccess: () => setEditingSection(null),
  })

  const isMandatarySelectionInvalid = false

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

      <form aria-label="Configuration de la commune">
        <section className="fr-mb-4w" aria-labelledby="district-config-section-title">
          <h2 id="district-config-section-title" className="fr-sr-only">
            Configuration de la commune
          </h2>
          {district && (
            <CommuneHeroCard className="fr-mb-3w">
              <Link
                href={`/commune/${district.codeCommune}`}
                className="commune-hero__link"
                aria-label={`Voir la fiche de la commune ${district.nomCommune}`}
              >
                {district?.codeCommune && (
                  <div className="commune-hero__blason">
                    <CommuneLogo codeCommune={district.codeCommune} alt="" size={COMMUNE_LOGO_SIZE_SMALL} maxWidth={COMMUNE_LOGO_SIZE_SMALL} />
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
                  <strong>{(district.nbVoies ?? 0).toLocaleString('fr-FR')}</strong> voies
                </span>
                <span className="commune-hero__stat">
                  <strong>{(district.nbNumeros ?? 0).toLocaleString('fr-FR')}</strong> adr.
                </span>
                <span className="commune-hero__stat">
                  <strong>{(district.nbLieuxDits ?? 0).toLocaleString('fr-FR')}</strong> l.-dits
                </span>
                <span className="commune-hero__stat">
                  {(district.nbNumeros ?? 0) > 0
                    ? (() => {
                        const nbNumeros = district.nbNumeros ?? 0
                        const nbCertifies = district.nbNumerosCertifies ?? 0
                        const taux = Math.round((nbCertifies / nbNumeros) * 100)
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
                              {nbCertifies.toLocaleString('fr-FR')} adr.
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

          {isAssemblage && (
            <Alert
              severity="warning"
              title="Commune en assemblage"
              description={(
                <>
                  Cette commune ne dispose pas encore de Base Adresse Locale (BAL). Les options de paramétrage et de délégation ne sont pas disponibles. Créez votre première BAL pour alimenter la Base Adresse Nationale.{' '}
                  <Link href="https://adresse.data.gouv.fr/programme-bal" className="fr-link">
                    Comment créer votre BAL
                  </Link>
                </>
              )}
              small
              className="fr-mb-3w"
            />
          )}
          {!hasBanId && !isAssemblage && (
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
                <div className="sec-card__title-row">
                  <span className="fr-icon fr-icon-file-text-line sec-card__icon" aria-hidden="true" />
                  <h3 className="sec-card__title">Certificat d&apos;adressage</h3>
                </div>
                <div className="sec-card__header-content">
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
              {!readOnly && hasBanId && !isAssemblage && (
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
                <p className="fr-text--sm fr-mb-3w">À noter : l&apos;émission d&apos;un certificat d&apos;adressage n&apos;est possible que pour les adresses certifiées et rattachées à une parcelle cadastrale.</p>
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
                <div className="sec-card__title-row">
                  <span className="fr-icon fr-icon-settings-5-line sec-card__icon" aria-hidden="true" />
                  <h3 className="sec-card__title">Paramètres dans le système BAN</h3>
                </div>
                <div className="sec-card__header-content">
                  <BalParamsSummary
                    defaultBalLang={configState?.defaultBalLang || DEFAULT_CODE_LANGUAGE}
                    availableLanguage={availableLanguage}
                    altLangCodes={altLangCodes}
                    redressementOdonymes={true}
                    communesAnciennes={true}
                  />
                </div>
              </div>
              {!readOnly && hasBanId && (
                <Button
                  type="button"
                  priority="secondary"
                  iconId={editingSection === 'parametrage' ? 'fr-icon-close-line' : 'fr-icon-edit-line'}
                  iconPosition="left"
                  size="small"
                  disabled
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
                <div className="sec-card__title-row">
                  <span className="fr-icon fr-icon-team-line sec-card__icon" aria-hidden="true" />
                  <h3 className="sec-card__title">Délégation</h3>
                </div>
                <div className="sec-card__header-content">
                  <p className="sec-card__value fr-mb-0">
                    La Source de publication des adresses BAL de votre commune.
                  </p>
                </div>
              </div>
            </div>
            <div className="sec-card__body">
              {(recapLoading || revisionsLoading)
                ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem' }} aria-busy="true">
                      <Loader size={36} />
                    </div>
                  )
                : (
                    <>
                      {multipleProducersInRecentRevisions.active && (
                        <Alert
                          severity="info"
                          title="Plusieurs sources dans les dernières publications"
                          description="Des publications par différents producteurs ont été constatées pour cette commune. Attention, il est nécessaire de s'assurer de la continuité des données entre différentes versions de la BAL."
                          small
                          className="fr-mb-2w"
                        />
                      )}
                      <div className="mandatary-row fr-mb-3w">
                        <span className="fr-icon fr-icon-user-line mandatary-row__icon" aria-hidden="true" />
                        <div className="mandatary-row__info">
                          {(recapError || revisionsError)
                            ? 'Indisponible'
                            : isAssemblage
                              ? <span className="fr-hint-text">Aucune publication — cette commune n&apos;a pas encore de BAL.</span>
                              : (() => {
                                  const { mode, source } = getSourceDisplayFromMap(effectiveClientId, clientIdToDisplay)
                                  return (
                                    <>
                                      <div>
                                        <span className="mandatary-row__label">Source</span>
                                        <span className="mandatary-row__name">{source}</span>
                                      </div>
                                      <div>
                                        <span className="mandatary-row__label">Mode de publication</span>
                                        <span className="mandatary-row__name">{mode}</span>
                                      </div>
                                    </>
                                  )
                                })()}
                        </div>
                        {/* Modification désactivée (alignement choix de source)
                {!enableMandataryChange && !readOnly && (
                  <Button
                    type="button"
                    priority="secondary"
                    iconId="fr-icon-edit-line"
                    iconPosition="left"
                    size="small"
                    disabled={!hasBanId}
                    onClick={() => {
                      setEnableMandataryChange(true)
                      if (!configState?.mandatary && effectiveClientId) {
                        setConfigState({ ...configState, mandatary: effectiveClientId })
                      }
                    }}
                  >
                    Modifier
                  </Button>
                )}
                */}
                      </div>

                      {/* Bloc changement de source désactivé (alignement en cours)
              {enableMandataryChange && (
                <>
                  <hr className="fr-hr mandatary-edit-sep" />
                  <Alert
                    severity="info"
                    title="Attention"
                    description="En cas de changement de source de publication, pour assurer la cohérence de la donnée, merci de vous assurer avec le nouveau producteur d'être bien reparti de la version précédente de la BAL, dont une copie est disponible sur la page commune (fichier Format Local - BAL)."
                    small
                    className="fr-mb-2w"
                  />
                  <Checkbox
                    options={[{
                      label: 'J\'ai compris les risques associés au changement de source pour ma commune.',
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
                    <>
                      <SourceSelector
                        sourceOptions={sourceOptions}
                        effectiveClientId={effectiveClientId}
                        configState={configState}
                        enableMandataryChangeWarning={enableMandataryChangeWarning}
                        hasBanId={hasBanId}
                        revisionsLoading={revisionsLoading}
                        revisionsError={revisionsError}
                        handleUpdateConfig={handleUpdateConfig}
                      />
                      <p className="fr-hint-text fr-mt-1w fr-mb-0">
                        Si vous souhaitez désigner une source qui n&apos;a jamais publié pour cette commune,{' '}
                        <Link href="/nous-contacter">contactez le support</Link>.
                      </p>
                    </>
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
                      Annuler & conserver ma source actuelle
                    </Button>
                  </div>
                </>
              )}
              */}
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
            saveDisabledAriaLabel="Enregistrer les modifications"
          />
        )}
      </form>
    </div>
  )
}

export default DistrictAdmin
