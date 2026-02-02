import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Select } from '@codegouvfr/react-dsfr/Select'
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import Link from 'next/link'
import { CommuneConfigItem } from './DistrictActions/DistrictActions.styles'
import language from './DistrictActions/langues-regionales.json'

import { type BANCommune, CertificateTypeEnum, CertificateTypeLabel } from '@/types/api-ban.types'

const DEFAULT_CODE_LANGUAGE = 'fra'
const DEFAULT_MANDATORY_ID = 'mairie'

const AdminContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h4 + .fr-hint-text {
    margin-top: -2em;
  }
`

const DistrictOptionsFormWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .fr-toggle .fr-hint-text {
    // Fix for Reac-DSFR issue where hint text has extra top margin
    margin-top: 0;
  }
`

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
    if (a.id === DEFAULT_MANDATORY_ID) return -1 // Default Mandatory should always be first
    if (b.id === DEFAULT_MANDATORY_ID) return 1 // Default Mandatory should always be first
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  })

const availableLanguage = language
  .filter(lang => lang.code.length === 3) // Exclude unsuported values (e.g. 'fr-gallo', 'en', 'de')
  .map(lang => ({
    code: lang.code,
    label: lang.label,
    formatedLabel: `${lang.label.charAt(0).toUpperCase()}${lang.label.slice(1)}`,
  })).sort((a, b) => {
    if (a.code === DEFAULT_CODE_LANGUAGE) return -1 // Default Language should always be first
    if (b.code === DEFAULT_CODE_LANGUAGE) return 1 // Default Language should always be first
    if (a.label < b.label) return -1
    if (a.label > b.label) return 1
    return 0
  })

interface DistrictOptionsFormProps {
  config: BANCommune['config']
  onUpdateConfig: (config: BANCommune['config']) => void
  readOnly?: boolean
}

function DistrictAdmin({ config, onUpdateConfig = () => true, readOnly = false }: DistrictOptionsFormProps) {
  const [currentConfig, setCurrentConfig] = useState<string>(JSON.stringify({ ...config }))
  const [configState, setConfigState] = useState<BANCommune['config']>({ ...config })
  const [enableMandataryChange, setEnableMandataryChange] = useState<boolean>(false)
  const [enableMandataryChangeWarning, setEnableMandataryChangeWarning] = useState<boolean>(false)

  const handleUpdateConfig = useCallback((updatedConfig: BANCommune['config']) => {
    setConfigState(updatedConfig)
  }, [onUpdateConfig])

  const pushConfigUpdate = useCallback(() => {
    const newConfig = { ...configState }
    onUpdateConfig(newConfig)
    setCurrentConfig(JSON.stringify(newConfig))
  }, [configState, onUpdateConfig])

  return (
    <AdminContentWrapper>
      <form>
        <section>
          <h4>Certificat d'adressage</h4>
          <p className='fr-hint-text'>Certifiez l'existance d'une adresse sur le territoire de votre commune.</p>
          <p>A noter : L’émission d'un certificat d’adressage n’est possible que pour les adresses certifiées et rattachées à une parcelle.</p>
          <DistrictOptionsFormWrapper>
            <li>
              {!readOnly
                ? (
                    <>
                      <div className="fr-fieldset__element">
                        <div className="fr-radio-group">
                          <input
                            type="radio"
                            id="radio-disabled"
                            name="certification-type"
                            value={CertificateTypeEnum.DISABLED}
                            checked={configState?.certificate === CertificateTypeEnum.DISABLED || !configState?.certificate}
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
                      }</b>
                    </CommuneConfigItem>
                  )}
            </li>
          </DistrictOptionsFormWrapper>
        </section>

        <section>
          <h4>Paramétrage des options</h4>
          <p className='fr-hint-text'>Indiquez à la BAN les options de traitement spécifiques aux fichiers BAL de votre commune.</p>
          <DistrictOptionsFormWrapper>
            <li>
              {!readOnly
                ? (
                    <div>
                      <Select
                        label="Langue par défaut des odonymes"
                        hint="Langue par défaut des odonymes fournis dans le fichier BAL sur les champs 'toponyme' (BAL 1.5) ou 'voie_nom' (BAL 1.4)."
                        nativeSelectProps={{
                          onChange: event => handleUpdateConfig({
                            ...configState,
                            defaultLanguage: event.target.value,
                          }),
                          value: configState?.defaultLanguage || DEFAULT_CODE_LANGUAGE
                        }}
                      >
                        <option value="" disabled hidden>Selectionnez une langue</option>
                        {availableLanguage.map(lang => (
                          <option
                            key={lang.code}
                            value={lang.code}
                            selected={configState?.defaultLanguage === lang.code}
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
                      <b>{config?.defaultLanguage || DEFAULT_CODE_LANGUAGE}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            <li>
              {!readOnly
                ? (
                    <ToggleSwitch
                      label="Redressement automatique des odonymes"
                      helperText="Corrige les odonymes pour respecter les règles typographiques recommandé par le Standard Adresse."
                      checked={configState?.autoFixLabels === false ? false : true}
                      showCheckedHint={false}
                      labelPosition="left"
                      onChange={(checked) => handleUpdateConfig({
                        ...configState,
                        autoFixLabels: checked,
                      })}
                    />
                  )
                : (
                    <CommuneConfigItem className="fr-icon-font-size">
                      Redressement automatique des odonymes :{' '}
                      <b>{config?.autoFixLabels === false ? 'Désactivé' : 'Activé'}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            <li>
              {!readOnly
                ? (
                    <ToggleSwitch
                      label="Calcul automatique des communes anciennes"
                      helperText="Ajoute aux adresses l’information de la commune ancienne (Cette information peut permettre de distinguer les possibles doublons de voies ou adresses)."
                      checked={configState?.computOldDistrict === false ? false : true}
                      showCheckedHint={false}
                      labelPosition="left"
                      onChange={checked => handleUpdateConfig({
                        ...configState,
                        computOldDistrict: checked,
                      })}
                    />
                  )
                : (
                    <CommuneConfigItem className="fr-icon-france-line">
                      Calcul automatique des communes anciennes :{' '}
                      <b>{config?.computOldDistrict === false ? 'Désactivé' : 'Activé'}</b>
                    </CommuneConfigItem>
                  )}
            </li>
            <li>
              {!readOnly
                ? (
                    <ToggleSwitch
                      label="Calcul automatique des clés d’interopérabilités"
                      helperText="Calcule les clés d'interopérabilité. (⚠ Attention : Si activé, les valeurs calculées remplacent celles fournies dans le fichier BAL)"
                      checked={configState?.computInteropKey === false ? false : true}
                      showCheckedHint={false}
                      labelPosition="left"
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
          </DistrictOptionsFormWrapper>
        </section>

        <section>
          <h4>Délégation</h4>
          <p className='fr-hint-text'>Gérez le mandataire autorisé à nous déposer des fichiers BAL pour votre commune.</p>
          <p>
            Seul le mandataire déclaré est autorisé à déposer des BAL pour votre commune.<br />
            Votre mandataire actuel : <b>Municipalité via Mes adresses</b>{' '}
          </p>

          {!enableMandataryChange ? (
            <DistrictOptionsFormWrapper>
              <li>
                <Button
                  type="button"
                  priority="primary"
                  iconId="ri-edit-2-line"
                  onClick={() => setEnableMandataryChange(true)}
                  size="small"
                >
                  Modifier mon mandataire
                </Button>
              </li>
            </DistrictOptionsFormWrapper>
          ) : (
            <DistrictOptionsFormWrapper>
              <li>
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
                            console.log('elem checked', checkbox.target.checked);
                            // Handle checkbox change
                            if (checkbox.target.checked) {
                              setEnableMandataryChangeWarning(true);
                            } else {
                              setConfigState({
                                ...configState,
                                mandatary: config?.mandatary,
                              })
                              setEnableMandataryChangeWarning(false);
                            }
                          }
                        }
                      }
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
                    setEnableMandataryChangeWarning(false);
                    setEnableMandataryChange(false);
                  }}
                  size="small"
                >
                  Annuler & conserver mon mandataire actuel
                </Button>
              </li>
              <li>
                {!readOnly
                  ? (
                      <div>
                        <Select
                          label="Mandataire de la commune"
                          hint={<>
                            Seul les organismes adhérents à la{' '}
                            <Link href="/communaute/charte-base-adresse-locale">Charte de la Base Adresse Locale</Link>{' '}
                            sont éligibles au statut de mandataire.
                          </>}
                          nativeSelectProps={{
                            onChange: event => handleUpdateConfig({
                              ...configState,
                              mandatary: event.target.value,
                            }),
                            value: enableMandataryChangeWarning ? configState?.mandatary : config?.mandatary || DEFAULT_MANDATORY_ID,
                            defaultValue: enableMandataryChangeWarning ? configState?.mandatary : config?.mandatary || DEFAULT_MANDATORY_ID,
                          }}
                            disabled={!enableMandataryChangeWarning}
                        >
                          <option value="" disabled hidden>Selectionnez une langue</option>
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
                    )
                }
              </li>
            </DistrictOptionsFormWrapper>
          )}

          {!readOnly && (
            <footer>
              { JSON.stringify(configState) !== currentConfig && (
                <>
                  <Button
                    type="button"
                    priority="secondary"
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
                disabled={JSON.stringify(configState) === currentConfig}
                onClick={() => pushConfigUpdate()}
              >
                Enregistrer les modifications
              </Button>
            </footer>
          )}
        </section>
      </form>
    </AdminContentWrapper>
  )
}

export default DistrictAdmin
