import { useState, useCallback, useEffect, useMemo } from 'react'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Button } from '@codegouvfr/react-dsfr/Button'

import { ParcelsWrapper, ListParcelsWrapper } from './FormBanParcels.styles'

export type ParcelId = string

export interface FormBanParcelsProps {
  name?: string
  label?: string
  hintText?: string
  placeholder?: string
  values?: ParcelId[]
  zeroSizePlaceholder?: string
  onChange?: (values: ParcelId[]) => void
  hasLabelOnly?: boolean
  isRequired?: boolean
  isWithScroll?: boolean
}

function FormBanParcels({
  name,
  label,
  hintText,
  placeholder,
  values = [],
  zeroSizePlaceholder,
  onChange,
  hasLabelOnly,
  isRequired,
  isWithScroll,
}: FormBanParcelsProps) {
  const [parcels, setParcels] = useState<ParcelId[]>(values)

  useEffect(() => {
    if (onChange) onChange(parcels)
  }, [parcels, onChange])

  const handleChangeValue = useCallback((index: number, value: string) => {
    const newParcels = [...parcels]
    newParcels[index] = value || ''
    setParcels(newParcels)
  }, [parcels])

  const handleRemoveParcel = useCallback((index: number) => {
    const newParcels = [...parcels]
    newParcels.splice(index, 1)
    setParcels(newParcels)
  }, [parcels])

  return (
    <div className="fr-input-group">
      {label && (
        <label
          className="fr-label"
          htmlFor={`${name}-${0}`}
        >
          {label}
          {hintText && <span className="fr-hint-text">{hintText.replace('{{size}}', `${parcels.length || zeroSizePlaceholder || 0}`)}</span>}
        </label>
      )}

      {!hasLabelOnly && (
        <ListParcelsWrapper $isSmall={isWithScroll}>
          {parcels.map((value, index) => (
            <ParcelsWrapper key={index}>
              <Input
                label={label}
                hideLabel
                nativeInputProps={{
                  type: 'text',
                  id: `${name}-${index}`,
                  value,
                  placeholder,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChangeValue(index, e.target.value),
                }}
              />
              {(index !== 0 || !isRequired) && (
                <Button
                  type="button"
                  iconId="fr-icon-delete-line"
                  onClick={() => handleRemoveParcel(index)}
                  priority="tertiary no outline"
                  title="Supprimer"
                />
              )}
            </ParcelsWrapper>
          ))}

          <Button
            type="button"
            onClick={() => setParcels([...parcels, '' as ParcelId])}
            iconId="fr-icon-add-line"
            priority="tertiary no outline"
            size="small"
          >
            Ajouter un identifiant de parcelle
          </Button>
        </ListParcelsWrapper>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(parcels.filter(Boolean))}
        />
      )}
    </div>
  )
}

export default FormBanParcels
