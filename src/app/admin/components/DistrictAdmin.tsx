import React, { useCallback, useState, useEffect } from 'react'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Checkbox } from '@codegouvfr/react-dsfr/Checkbox'
import { Alert } from '@codegouvfr/react-dsfr/Alert'
import { Badge } from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'
import { CommuneConfigItem } from './DistrictActions/DistrictActions.styles'
import language from './DistrictActions/langues-regionales.json'
import { CommuneStatusBadge } from './CommuneStatusBadge'

import { type BANCommune, CertificateTypeEnum, CertificateTypeLabel } from '@/types/api-ban.types'
import { Commune } from '@/types/api-geo.types'
import { type UserInfo } from '@/hooks/useAuth'
import { customFetch } from '@/lib/fetch'
import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'

const DEFAULT_CODE_LANGUAGE = 'fra'
const DEFAULT_MANDATORY_ID = 'mairie'

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

// FIXME: Available mandatories should come from an API or a constants file
const mandatories = [
  { id: 'mairie', label: 'Mairie' },
  { id: 'intercommunalite', label: 'Intercommunalité' },
  { id: 'departement', label: 'Département' },
  { id: 'region', label: 'Région' },
  { id: 'etat', label: 'État' },
]

const availableMandatary = mandatories
  .map(mandatory => ({
    id: mandatory.id,
    label: mandatory.label,
  })).sort((a, b) => {
    if (a.id === DEFAULT_MANDATORY_ID) return -1
    if (b.id === DEFAULT_MANDATORY_ID) return 1
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  })

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

type MessageType = 'success' | 'error' | 'info'

interface Message {
  text: string
  type: MessageType
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
  const [message, setMessage] = useState<Message | null>(null)
  const [flagUrl, setFlagUrl] = useState<string>('')
  const [isSaving, setIsSaving] = useState<boolean>(false)

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

  const handleUpdateConfig = useCallback((updatedConfig: BANCommune['config']) => {
    setConfigState(updatedConfig)
  }, [])

  const saveDistrictConfig = useCallback(async (newConfig: BANCommune['config'], originalConfig: BANCommune['config']) => {
    try {
      if (userInfo && district) {
        const body = {
          districtID: district.banId,
          config: newConfig,
          originalConfig: originalConfig,
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }

        await customFetch(`/api/addressing-certification-enable`, options)
      }
    }
    catch (error: any) {
      console.error('Error saving district config', error)
      setMessage({ text: `Une erreur est survenue lors de la sauvegarde. (${error?.message || 'Erreur inconnue'})`, type: 'error' })
      throw error
    }
  }, [district, userInfo])

  const pushConfigUpdate = useCallback(async () => {
    setMessage(null)
    setIsSaving(true)
    const newConfig = { ...configState }

    try {
      await saveDistrictConfig(newConfig, config)
      onUpdateConfig(newConfig)
      setCurrentConfig(JSON.stringify(newConfig))
      setMessage({
        text: 'Modifications enregistrées avec succès.',
        type: 'success',
      })
    }
    catch (e) {
      console.error(e)
      setMessage({
        text: 'Une erreur est survenue lors de l\'enregistrement.',
        type: 'error',
      })
    }
    finally {
      setIsSaving(false)
    }
  }, [configState, config, onUpdateConfig, saveDistrictConfig])

  if (loading) {
    return (
      <div className="fr-container--fluid">
        <p>Chargement des informations de la commune...</p>
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
    <div className="fr-container--fluid">

      <form>
        {message && (
          <Alert
            severity={message.type}
            title={message.type === 'error' ? 'Erreur' : message.type === 'success' ? 'Succès' : 'Information'}
            description={message.text}
            small
            closable
            onClose={() => setMessage(null)}
            className="fr-mb-3w"
          />
        )}
        <section className="fr-mb-6w">
          {district && (
            <div className="fr-mb-3w">
              <Link href={`/commune/${district.codeCommune}`} className="fr-link" style={{ textDecoration: 'none' }}>
                <div className="fr-card fr-card--horizontal fr-card--grey fr-card--no-border">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        {flagUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={flagUrl}
                            alt={`Logo de ${district.nomCommune}`}
                            width={48}
                            height={48}
                            style={{ objectFit: 'contain', flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h5 className="fr-card__title fr-text--md fr-mb-0">
                            {district.nomCommune}
                          </h5>
                          <p className="fr-text--sm fr-text-mention--grey fr-mb-0">
                            {district.codeCommune} • {formatDate(district.dateRevision)}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div className="fr-text--xs fr-text-mention--grey fr-mb-1w">État BAL</div>
                            {district ? <CommuneStatusBadge commune={district} /> : <span className="fr-text--xs">-</span>}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div className="fr-text--xs fr-text-mention--grey fr-mb-1w">Voies</div>
                            <div className="fr-text--md fr-text--bold">{district.nbVoies.toLocaleString('fr-FR')}</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div className="fr-text--xs fr-text-mention--grey fr-mb-1w">Adresses</div>
                            <div className="fr-text--md fr-text--bold">{district.nbNumeros.toLocaleString('fr-FR')}</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div className="fr-text--xs fr-text-mention--grey fr-mb-1w">Lieux-dits</div>
                            <div className="fr-text--md fr-text--bold">{district.nbLieuxDits > 0 ? district.nbLieuxDits.toLocaleString('fr-FR') : '0'}</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div className="fr-text--xs fr-text-mention--grey fr-mb-1w">Certifiées</div>
                            {district.nbNumeros > 0
                              ? (
                                  <>
                                    <div className="fr-text--md fr-text--bold">
                                      {Math.round((district.nbNumerosCertifies / district.nbNumeros) * 100)}%
                                    </div>
                                    <div className="fr-text--xs fr-text-mention--grey">
                                      {district.nbNumerosCertifies.toLocaleString('fr-FR')} adresse{district.nbNumerosCertifies > 1 ? 's' : ''}
                                    </div>
                                  </>
                                )
                              : (
                                  <div className="fr-text--md fr-text--bold">0%</div>
                                )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
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

          <div className="fr-mb-3w">
            <h4 className="fr-mb-0">Certificat d&apos;adressage</h4>
            <p className="fr-hint-text fr-mt-1w fr-mb-0">Certifiez l&apos;existence d&apos;une adresse sur le territoire de votre commune.</p>
            <p className="fr-mt-2w fr-mb-0">A noter : L&apos;émission d&apos;un certificat d&apos;adressage n&apos;est possible que pour les adresses certifiées et rattachées à une parcelle.</p>
          </div>

          <ul className="fr-raw-list fr-mt-4w">
            <li className="fr-mb-2w">
              {!readOnly
                ? (
                    <>
                      {!isUserAuthorized && (
                        <Alert
                          severity="warning"
                          title="Activation impossible"
                          description="Votre compte ne semble pas rattaché à cette commune (SIREN différent). Vous ne pouvez pas activer la certification."
                          small
                        />
                      )}
                      {!hasTechnicalRequirements && isUserAuthorized && (
                        <Alert
                          severity="warning"
                          title="Conditions techniques non remplies"
                          description="Cette commune ne dispose pas d'adresses certifiées. L'émission de certificats est impossible."
                          small
                        />
                      )}
                      <div className="fr-fieldset__element">
                        <div className="fr-radio-group">
                          <input
                            type="radio"
                            id="radio-disabled"
                            name="certification-type"
                            value={CertificateTypeEnum.DISABLED}
                            checked={configState?.certificate === CertificateTypeEnum.DISABLED || !configState?.certificate}
                            disabled={!isUserAuthorized || !hasBanId}
                            onChange={() => handleUpdateConfig({
                              ...configState,
                              certificate: CertificateTypeEnum.DISABLED,
                            })}
                          />
                          <label className="fr-label" htmlFor="radio-disabled"> {CertificateTypeLabel[CertificateTypeEnum.DISABLED]}
                            <span className="fr-hint-text">Les certificats d&lsquo;adressage ne sont pas disponible pour cette commune depuis le site adresse.data.gouv.fr.</span>
                          </label>
                        </div>
                      </div>

                      <div className="fr-fieldset__element">
                        <div className="fr-radio-group">
                          <input
                            type="radio"
                            id="radio-district"
                            name="certification-type"
                            value={CertificateTypeEnum.DISTRICT}
                            checked={configState?.certificate === CertificateTypeEnum.DISTRICT}
                            disabled={!isUserAuthorized || !hasTechnicalRequirements || !hasBanId}
                            onChange={() => handleUpdateConfig({
                              ...configState,
                              certificate: CertificateTypeEnum.DISTRICT,
                            })}
                          />
                          <label className="fr-label" htmlFor="radio-district"> {CertificateTypeLabel[CertificateTypeEnum.DISTRICT]}
                            <span className="fr-hint-text">Les certificats seront téléchargeables depuis le site adresse.data.gouv.fr par toute personne connecté avec une adresse Email rattachée à la mairie de la commune.</span>
                          </label>
                        </div>
                      </div>

                      <div className="fr-fieldset__element">
                        <div className="fr-radio-group">
                          <input
                            type="radio"
                            id="radio-all"
                            name="certification-type"
                            value={CertificateTypeEnum.ALL}
                            checked={configState?.certificate === CertificateTypeEnum.ALL}
                            disabled={!isUserAuthorized || !hasTechnicalRequirements || !hasBanId}
                            onChange={() => handleUpdateConfig({
                              ...configState,
                              certificate: CertificateTypeEnum.ALL,
                            })}
                          />
                          <label className="fr-label" htmlFor="radio-all"> {CertificateTypeLabel[CertificateTypeEnum.ALL]}
                            <span className="fr-hint-text">Les certificats sont librement téléchargeables depuis le site adresse.data.gouv.fr. par tous.</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )
                : (
                    <CommuneConfigItem className="ri-file-paper-2-line">
                      Etat actuel de la fonctionnalité :{' '}
                      <b>{
                        config?.certificate === CertificateTypeEnum.DISTRICT
                          ? CertificateTypeLabel[CertificateTypeEnum.DISTRICT]
                          : config?.certificate === CertificateTypeEnum.ALL
                            ? CertificateTypeLabel[CertificateTypeEnum.ALL]
                            : CertificateTypeLabel[CertificateTypeEnum.DISABLED]
                      }
                      </b>
                    </CommuneConfigItem>
                  )}
            </li>
          </ul>
        </section>

        <section className="fr-mb-6w">
          <h4>Paramétrage des options</h4>
          <p className="fr-hint-text">Indiquez à la BAN les options de traitement spécifiques aux fichiers BAL de votre commune.</p>
          <ul className="fr-raw-list fr-mt-4w">
            <li className="fr-mb-2w">
              {!readOnly
                ? (
                    <div>
                      <Select
                        label="Langue par défaut des odonymes"
                        hint="Langue par défaut des odonymes fournis dans le fichier BAL sur les champs 'toponyme' (BAL 1.5) ou 'voie_nom' (BAL 1.4)."
                        disabled={!hasBanId}
                        nativeSelectProps={{
                          onChange: event => handleUpdateConfig({
                            ...configState,
                            defaultBalLang: event.target.value,
                          }),
                          value: configState?.defaultBalLang || DEFAULT_CODE_LANGUAGE,
                          disabled: !hasBanId,
                        }}
                      >
                        <option value="" disabled hidden>Sélectionnez une langue</option>
                        {availableLanguage.map(lang => (
                          <option
                            key={lang.code}
                            value={lang.code}
                            selected={configState?.defaultBalLang === lang.code}
                            style={{ textTransform: 'capitalize' }}
                          >
                            {lang.formatedLabel}
                          </option>
                        ))}
                      </Select>
                    </div>
                  )
                : (
                    <CommuneConfigItem className="ri-global-line">
                      Langue par defaut des odonymes :{' '}
                      <b>{config?.defaultBalLang || DEFAULT_CODE_LANGUAGE}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            <li className="fr-mb-2w">
              {!readOnly
                ? (
                    <ToggleSwitch
                      label="Redressement automatique des odonymes"
                      helperText="Corrige les odonymes pour respecter les règles typographiques recommandé par le Standard Adresse."
                      checked={true}
                      showCheckedHint={false}
                      labelPosition="left"
                      disabled={true}
                      onChange={() => {}}
                    />
                  )
                : (
                    <CommuneConfigItem className="fr-icon-font-size">
                      Redressement automatique des odonymes :{' '}
                      <b>{config?.autoFixLabels === false ? 'Désactivé' : 'Activé'}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            <li className="fr-mb-2w">
              {!readOnly
                ? (
                    <ToggleSwitch
                      label="Calcul automatique des communes anciennes"
                      helperText="Ajoute aux adresses l’information de la commune ancienne (Cette information peut permettre de distinguer les possibles doublons de voies ou adresses)."
                      checked={true}
                      showCheckedHint={false}
                      labelPosition="left"
                      disabled={true}
                      onChange={() => {}}
                    />
                  )
                : (
                    <CommuneConfigItem className="fr-icon-france-line">
                      Calcul automatique des communes anciennes :{' '}
                      <b>{config?.computOldDistrict === false ? 'Désactivé' : 'Activé'}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            {/* Temporairement désactivé - à réactiver plus tard
            <li className="fr-mb-2w">
              {!readOnly
                ? (
                    <ToggleSwitch
                      label="Calcul automatique des clés d’interopérabilités"
                      helperText="Calcule les clés d'interopérabilité. (⚠ Attention : Si activé, les valeurs calculées remplacent celles fournies dans le fichier BAL)"
                      checked={configState?.computInteropKey === false ? false : true}
                      showCheckedHint={false}
                      labelPosition="left"
                      disabled={!hasBanId}
                      onChange={checked => handleUpdateConfig({ ...configState, computInteropKey: checked })}
                    />
                  )
                : (
                    <CommuneConfigItem className="ri-links-line">
                      Calcul automatique des clés d’interopérabilités :{' '}
                      <b>{config?.computInteropKey === false ? 'Désactivé' : 'Activé'}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            */}
          </ul>
        </section>

        <section className="fr-mb-6w">
          <h4>Délégation</h4>
          <p className="fr-hint-text">Gérez le mandataire autorisé à nous déposer des fichiers BAL pour votre commune.</p>
          <p>
            Seul le mandataire déclaré est autorisé à déposer des BAL pour votre commune.<br />
            Votre mandataire actuel : <b>Municipalité via Mes adresses</b>
            {' '}
          </p>

          {!enableMandataryChange
            ? (
                <ul className="fr-raw-list fr-mt-4w">
                  <li className="fr-mb-2w">
                    <Button
                      type="button"
                      priority="primary"
                      iconId="ri-edit-2-line"
                      onClick={() => setEnableMandataryChange(true)}
                      size="small"
                      disabled={!hasBanId}
                    >
                      Modifier mon mandataire
                    </Button>
                  </li>
                </ul>
              )
            : (
                <ul className="fr-raw-list fr-mt-4w">
                  <li className="fr-mb-2w">
                    <p className="ri-edit-2-line">{' '}
                      Selectionnez un mandataire pour
                      lui permettre des deposer des BAL en votre nom,
                      et lui donner accès aux parametrages des options de la commune.
                    </p>
                    <Alert
                      severity="warning"
                      title="Attention"
                      description={`
                            Tout changement de mandataire implique une possible et
                            temporaire interruption de dépôt de BAL.
                            Pour eviter une interruption de service et un blocage du fichier BAL,
                            assurez-vous que le nouveau mandataire est en capacité d'assurer
                            la continuité du service à partir des données existantes.
                          `}
                      small
                    /><br />
                    <Checkbox
                      options={[
                        {
                          label: 'J’ai compris les risques associés au changement de mandataire pour ma commune.',
                          nativeInputProps: {
                            name: 'checkboxes-1',
                            value: 'understood-mandatary-change-warning',
                            checked: enableMandataryChangeWarning,
                            onChange: (checkbox) => {
                              if (checkbox.target.checked) {
                                setEnableMandataryChangeWarning(true)
                              }
                              else {
                                setConfigState({
                                  ...configState,
                                  mandatary: config?.mandatary,
                                })
                                setEnableMandataryChangeWarning(false)
                              }
                            },
                          },
                        },
                      ]}
                      state="default"
                    />
                    <Button
                      type="button"
                      priority="secondary"
                      iconId="ri-close-line"
                      onClick={() => {
                        setConfigState({
                          ...configState,
                          mandatary: config?.mandatary,
                        })
                        setEnableMandataryChangeWarning(false)
                        setEnableMandataryChange(false)
                      }}
                      size="small"
                    >
                      Annuler & conserver mon mandataire actuel
                    </Button>
                  </li>
                  <li className="fr-mb-2w">
                    {!readOnly
                      ? (
                          <div>
                            <Select
                              label="Mandataire de la commune"
                              hint={(
                                <>
                                  Seul les organismes adhérents à la{' '}
                                  <Link href="/communaute/charte-base-adresse-locale">Charte de la Base Adresse Locale</Link>{' '}
                                  sont éligibles au statut de mandataire.
                                </>
                              )}
                              nativeSelectProps={{
                                onChange: event => handleUpdateConfig({
                                  ...configState,
                                  mandatary: event.target.value,
                                }),
                                value: enableMandataryChangeWarning ? configState?.mandatary : config?.mandatary || DEFAULT_MANDATORY_ID,
                                defaultValue: enableMandataryChangeWarning ? configState?.mandatary : config?.mandatary || DEFAULT_MANDATORY_ID,
                                disabled: !hasBanId,
                              }}
                              disabled={!enableMandataryChangeWarning || !hasBanId}
                            >
                              <option value="" disabled hidden>Sélectionnez un mandataire</option>
                              {availableMandatary.map(mandatary => (
                                <option
                                  key={mandatary.id}
                                  value={mandatary.id}
                                  style={{ textTransform: 'capitalize' }}
                                >
                                  {mandatary.label}
                                </option>
                              ))}
                            </Select>
                          </div>
                        )
                      : (
                          <CommuneConfigItem className="ri-global-line">
                            Mandataire de la commune :{' '}
                            <b>{config?.mandatary || mandatories.find(m => m.id === DEFAULT_MANDATORY_ID)?.label}</b>
                          </CommuneConfigItem>
                        )}
                  </li>
                </ul>
              )}

          {!readOnly && (
            <footer>
              { JSON.stringify(configState) !== currentConfig && (
                <>
                  <Button
                    type="button"
                    priority="secondary"
                    disabled={isSaving}
                    onClick={() => {
                      handleUpdateConfig({ ...config })
                    }}
                  >
                    Annuler les modifications
                  </Button>
                  {' '}
                </>
              )}
              <Button
                type="button"
                priority="primary"
                disabled={JSON.stringify(configState) === currentConfig || isSaving}
                onClick={() => pushConfigUpdate()}
              >
                {isSaving ? 'Enregistrement en cours...' : 'Enregistrer les modifications'}
              </Button>
            </footer>
          )}
        </section>
      </form>
    </div>
  )
}

export default DistrictAdmin
