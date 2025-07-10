import React from 'react'
import styled from 'styled-components'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Select } from '@codegouvfr/react-dsfr/Select'

import { CommuneConfigItem } from './CommuneActions.styles'
import language from './langues-regionales.json'

import type { BANCommune } from '@/types/api-ban.types'

const DEFAULT_CODE_LANGUAGE = 'fra'

const DistrictOptionsFormWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

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

function DistrictConfigForm({ config, onUpdateConfig, readOnly = true }: DistrictOptionsFormProps) {
  return (
    <DistrictOptionsFormWrapper>
      <li>
        {!readOnly
          ? (
              <div>
                <Select
                  label="Langue par defaut des odonymes"
                  hint="Langue par defaut des odonymes fournis dans le fichier BAL (Cette information permet d'ameliorer les outils de recherche et l'affichage sur les cartes en langue regionale)."
                  nativeSelectProps={{
                    onChange: event => onUpdateConfig(
                      { ...config, defaultLanguage: event.target.value }
                    ),
                    value: config?.defaultLanguage || DEFAULT_CODE_LANGUAGE }}
                >
                  <option value="" disabled hidden>Selectionnez une langue</option>
                  {availableLanguage.map(lang => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      selected={config?.defaultLanguage === lang.code}
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
                label="Redressement automatique des odonymes (“français” uniquement)"
                helperText="Corrige les odonymes pour respecter les règles typographiques recommandé par le Standard Adresse."
                checked={config?.autoFixLabels === false ? false : true}
                showCheckedHint={false}
                labelPosition="left"
                onChange={checked => onUpdateConfig({ ...config, autoFixLabels: checked })}
              />
            )
          : (
              <CommuneConfigItem className="fr-icon-font-size">
                Redressement automatique des odonymes (“français” uniquement) :{' '}
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
                checked={config?.computOldDistrict === false ? false : true}
                showCheckedHint={false}
                labelPosition="left"
                onChange={checked => onUpdateConfig({ ...config, computOldDistrict: checked })}
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
                helperText="Calcule les clés d'interopérabilité. (⚠ Les valeurs calculées remplacent celles fournies dans le fichier BAL)"
                checked={config?.computInteropKey === false ? false : true}
                showCheckedHint={false}
                labelPosition="left"
                onChange={checked => onUpdateConfig({ ...config, computInteropKey: checked })}
              />
            )
          : (
              <CommuneConfigItem className="ri-links-line">
                Calcul automatique des clés d’interopérabilités :{' '}
                <b>{config?.computInteropKey === false ? 'Désactivé' : 'Activé'}</b>
              </CommuneConfigItem>
            )}
      </li>
      <li>
        {!readOnly
          ? (
              <ToggleSwitch
                label="Certificat d’adressage"
                helperText="Active le téléchargement des certificats d’adressages pour les adresses certifiées et possédant au moins une parcelle cadastrale."
                checked={Boolean(config?.certificate)}
                showCheckedHint={false}
                labelPosition="left"
                onChange={checked => onUpdateConfig({ ...config, certificate: checked ? {} : undefined })}
              />
            )
          : (
              <CommuneConfigItem className="ri-file-paper-2-line">
                Certificat d’adressage :{' '}
                <b>{config?.certificate ? 'Activé' : 'Désactivé'}</b>
              </CommuneConfigItem>
            )}
      </li>
    </DistrictOptionsFormWrapper>

  )
}

export default DistrictConfigForm
