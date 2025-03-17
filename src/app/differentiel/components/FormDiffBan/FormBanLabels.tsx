import { useState, useCallback, useEffect, useMemo } from 'react'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Select } from '@codegouvfr/react-dsfr/Select'

import {
  LabelsWrapper,
} from './FormBanLabels.styles'

export interface Label {
  isoCode: string
  value: string
}

interface LangDefinition {
  lang: string
  region: string
}

const isoCodesLang: Record<string, LangDefinition> = {
  fra: { lang: 'Français', region: 'France' },
  bre: { lang: 'Breton', region: 'Bretagne' },
  eus: { lang: 'Basque', region: 'Pays Basque' },
  gsw: { lang: 'Alsacien', region: 'Alsace' },
  cos: { lang: 'Corse', region: 'Corse' },
  gcr: { lang: 'Guyanais', region: 'Guyane' },
  gcf: { lang: 'Guadeloupéen-Martiniquais', region: 'Guadeloupe et Martinique' },
  rcf: { lang: 'Réunionnais', region: 'La Réunion' },
  swb: { lang: 'Mahorais', region: 'Mayotte' },
  oci: { lang: 'Occitan', region: 'Occitanie' },
}

const emptyIsoCodesLang: Record<string, LangDefinition> = {
  '': { lang: '', region: '' },
}

const IsoCodesLang = {
  ...emptyIsoCodesLang,
  ...isoCodesLang,
}

interface SelectLangProps {
  id?: string
  label?: string
  hint?: string
  hideLabel?: boolean
  value?: keyof typeof IsoCodesLang
  disableValues?: (keyof typeof IsoCodesLang)[]
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectLang = ({ id, label, hint, hideLabel, value, disableValues, onChange }: SelectLangProps) => {
  return (
    <Select
      label={label}
      hint={hint}
      nativeSelectProps={{
        onChange,
        value,
        id,
        className: hideLabel ? 'FIX-DSFR-fr-select--hide-label' : '',
      }}
    >
      <option>Selectionnez une langue</option>
      {Object.entries(isoCodesLang).map(([code, { lang }]) => (
        <option
          key={code}
          value={code}
          selected={value === code}
          disabled={disableValues?.includes(code)}
        >{lang} ({code})
        </option>
      ))}
    </Select>
  )
}

export interface FormBanLabelsProps {
  name?: string
  label?: string
  hintText?: string
  placeholder?: string
  values?: Label[]
  onChange?: (values: Label[]) => void
  isRequired?: boolean
}

function FormBanLabels({
  name,
  label,
  hintText,
  placeholder,
  values = [],
  onChange,
  isRequired,
}: FormBanLabelsProps) {
  const [labels, setLabels] = useState<Label[]>(values)

  useEffect(() => {
    if (onChange) onChange(labels)
  }, [labels, onChange])

  const handleChangeLang = useCallback((index: number, isoCode: string) => {
    const newLabels = [...labels]
    newLabels[index].isoCode = isoCode || ''
    setLabels(newLabels)
  }, [labels])

  const handleChangeValue = useCallback((index: number, value: string) => {
    const newLabels = [...labels]
    newLabels[index].value = value || ''
    setLabels(newLabels)
  }, [labels])

  const handleRemoveLabel = useCallback((index: number) => {
    const newLabels = [...labels]
    newLabels.splice(index, 1)
    setLabels(newLabels)
  }, [labels])

  return (
    <div className="fr-input-group">
      {label && (
        <label
          className="fr-label"
        >
          {label}
          {hintText && <span className="fr-hint-text">{hintText}</span>}
        </label>
      )}

      {labels.map(({ isoCode, value }, index) => (
        <LabelsWrapper key={index}>
          <SelectLang
            label="Langue"
            hint="Code ISO 639-2"
            hideLabel
            value={isoCode}
            disableValues={labels.map(({ isoCode }) => isoCode)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeLang(index, e.target.value)}
          />
          <Input
            label={label || 'xx'}
            nativeInputProps={{
              type: 'text',
              value,
              placeholder,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChangeValue(index, e.target.value),
            }}
          />
          {(index !== 0 || !isRequired) && (
            <Button
              type="button"
              iconId="fr-icon-delete-line"
              onClick={() => handleRemoveLabel(index)}
              priority="tertiary no outline"
              title="Label button"
            />
          )}
        </LabelsWrapper>
      ))}

      <Button
        type="button"
        onClick={() => setLabels([...labels, { isoCode: '', value: '' }])}
        iconId="fr-icon-add-line"
        priority="tertiary no outline"
        size="small"
      >
        Ajouter une langue regionale
      </Button>

      {name && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(labels.filter(({ isoCode, value }) => isoCode && value))}
        />
      )}
    </div>
  )
}

export default FormBanLabels
