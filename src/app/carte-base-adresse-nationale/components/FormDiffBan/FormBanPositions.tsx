import { useState, useCallback, useEffect, useMemo } from 'react'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Button } from '@codegouvfr/react-dsfr/Button'
import { Select } from '@codegouvfr/react-dsfr/Select'

import {
  LabelWrapper,
} from './FormBanPositions.styles'

export interface Position {
  type: string
  lng: number | null
  lat: number | null
}

interface TypePositionConfig {
  name: string
  color: string
}

type TypePositionConfigs = Record<string, TypePositionConfig>

const positionsConfigs: TypePositionConfigs = {
  'entrée': { name: 'Entrée', color: '#00CED1' },
  'délivrance postale': { name: 'Délivrance postale', color: '#9370DB' },
  'bâtiment': { name: 'Bâtiment', color: '#CD5C5C' },
  'cage d’escalier': { name: 'Cage d’escalier', color: '#20B2AA' },
  'logement': { name: 'Logement', color: '#C71585' },
  'parcelle': { name: 'Parcelle', color: '#00BFFF' },
  'segment': { name: 'Segment', color: '#6B8E23' },
  'service technique': { name: 'Service technique', color: '#9932CC' },
  'inconnue': { name: 'Inconnu', color: '#787878' },
}

const emptyPositionConfig: TypePositionConfigs = {
  '': { name: '', color: '' },
}

const PositionsConfigs = {
  ...emptyPositionConfig,
  ...positionsConfigs,
}

interface SelectPositionTypeProps {
  id?: string
  value?: keyof typeof PositionsConfigs
  disableValues?: (keyof typeof PositionsConfigs)[]
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const SelectPositionType = ({ id, value, disableValues, onChange }: SelectPositionTypeProps) => {
  return (
    <Select
      label="Langue"
      hint="Code ISO 639-2"
      nativeSelectProps={{
        onChange,
        value,
        id,
      }}
    >
      <option>Selectionnez un type de position</option>
      {Object.entries(positionsConfigs).map(([key, { name }]) => (
        <option
          key={key}
          value={key}
          selected={value === key}
          disabled={disableValues?.includes(key)}
        >{name}
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
  values?: Position[]
  initValues: Position
  onChange?: (values: Position[]) => void
  isRequired?: boolean
}

function FormBanPositions({
  name,
  label,
  hintText,
  placeholder,
  values = [],
  initValues,
  isRequired: required,
  onChange,
}: FormBanLabelsProps) {
  const [positions, setPositions] = useState<Position[]>(values)

  useEffect(() => {
    if (onChange) onChange(positions)
  }, [positions, onChange])

  const handleChangeType = useCallback((index: number, type: string) => {
    const newPositions = [...positions]
    newPositions[index].type = type || ''
    setPositions(newPositions)
  }, [positions])

  const handleChangeLng = useCallback((index: number, lng: number) => {
    const newPositions = [...positions]
    newPositions[index].lng = lng
    setPositions(newPositions)
  }, [positions])

  const handleChangeLat = useCallback((index: number, lat: number) => {
    const newPositions = [...positions]
    newPositions[index].lat = lat
    setPositions(newPositions)
  }, [positions])

  const handleRemovePosition = useCallback((index: number) => {
    const newPositions = [...positions]
    newPositions.splice(index, 1)
    setPositions(newPositions)
  }, [positions])

  return (
    <div className="fr-input-group">
      {label && (
        <label className="fr-label">
          {label}
          {hintText && <span className="fr-hint-text">{hintText}</span>}
        </label>
      )}

      {positions.map(({ type, lng, lat }, index) => (
        <LabelWrapper key={index}>
          <SelectPositionType
            value={type}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChangeType(index, e.target.value)}
          />
          <Input
            label={`${label} - Longitude`}
            hideLabel
            nativeInputProps={{
              type: 'text',
              value: lng as number,
              placeholder,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChangeLng(index, Number(e.target.value)),
            }}
          />
          <Input
            label={`${label} - Latitude`}
            hideLabel
            nativeInputProps={{
              type: 'text',
              value: lat as number,
              placeholder,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChangeLat(index, Number(e.target.value)),
            }}
          />
          {(index !== 0 || !required) && (
            <Button
              type="button"
              iconId="fr-icon-delete-line"
              onClick={() => handleRemovePosition(index)}
              priority="tertiary no outline"
              title="Label button"
            />
          )}
        </LabelWrapper>
      ))}

      <Button
        type="button"
        onClick={() => setPositions([...positions, { type: '', lng: null, lat: null }])}
        iconId="fr-icon-add-line"
        priority="tertiary no outline"
        size="small"
      >
        Ajouter une position
      </Button>

      {name && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(positions.filter(({ type, lng, lat }) => type && lng && lat))}
        />
      )}
    </div>
  )
}

export default FormBanPositions
