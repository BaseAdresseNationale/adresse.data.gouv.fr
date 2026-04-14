import { useState } from 'react'
import { Input } from '@codegouvfr/react-dsfr/Input'
import { Button } from '@codegouvfr/react-dsfr/Button'

import FormBanLabels from './FormBanLabels'
import FormBanPositions from './FormBanPositions'

import { FormDiffSection } from './FormDiffBan.styles'

import type { Label } from './FormBanLabels'
import type { Position } from './FormBanPositions'

import {
  AddressNumberWrapper,
  InputCP,
} from './FormBanAddress.styles'

function FormBanAddress({ children, address }: { children?: React.ReactNode, address: any }) {
  const initialAddressLabels = (
    address?.lieuDitComplementNom
      ? [{ isoCode: 'fra', value: address?.lieuDitComplementNom }]
      : []
  ).concat(address?.lieuDitComplementNomAlt
    ? Object.entries(address?.lieuDitComplementNomAlt).map(([isoCode, value]) => ({ isoCode, value }))
    : []
  )

  interface PositionLegacy {
    position: {
      coordinates: [number, number]
    }
    positionType: string
  }

  const initialAddressPositions = (
    (address?.positions as PositionLegacy[]).map(
      ({ position: { coordinates }, positionType }) => ({
        type: positionType,
        lng: coordinates[0],
        lat: coordinates[1],
      })
    )
  )
  const [addressLabels, setAddressLabels] = useState<Label[]>(initialAddressLabels)
  const [addressPositions, setAddressPositions] = useState<Position[]>(initialAddressPositions)
  const defaultLang = 'fra' // TODO : Extract from config

  // console.log('addressPositions', addressPositions)

  return (
    <FormDiffSection>
      {children}

      <input type="hidden" value={address?.banIdDistrict} name="address.districtID" />
      <input type="hidden" value={address?.banIdMainCommonToponym} name="address.mainCommonToponymID" />
      <input type="hidden" value={address?.banId} name="address.id" />

      <AddressNumberWrapper>
        <Input
          label="N°" // TODO: Add controle for 99_999 value
          nativeInputProps={{
            inputMode: 'numeric',
            pattern: '[0-9]*',
            type: 'number',
            name: 'address.number',
            defaultValue: address?.numero || '',
          }}
        />

        <Input
          label="Suffix"
          nativeInputProps={{
            type: 'text',
            name: 'address.suffix',
            placeholder: 'bis, ter, quater, etc.',
            defaultValue: address?.suffixe || '',
          }}
        />
      </AddressNumberWrapper>

      <div>
        {addressLabels.length > 0
          ? (
              <FormBanLabels
                name="address.labels"
                label="Lieu-dit"
                hintText="Nom complementaire de l’adresse"
                placeholder="Nom du lieu-dit"
                values={addressLabels}
                onChange={labels => setAddressLabels(labels)}
              />
            )
          : (
              <Button
                type="button"
                onClick={() => setAddressLabels([...addressLabels, { isoCode: defaultLang, value: '' }])}
                iconId="fr-icon-add-line"
                priority="tertiary no outline"
                size="small"
              >
                Ajouter un Lieu-dit complementaire
              </Button>
            )}
      </div>

      <div>
        <InputCP
          label="Code postal"
          nativeInputProps={{
            // inputMode: 'numeric',
            // pattern: '[0-9]{5}',
            type: 'text',
            name: 'address.meta.laPoste.codePostal',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.setCustomValidity('')
              if (!e.target.validity.valid) {
                e.target.setCustomValidity('Le code postal doit être composé de 5 chiffres')
              }
            },
            defaultValue: address?.codePostal || '',
          }}
        />
      </div>

      <div>
        {addressPositions.length > 0
          ? (
              <FormBanPositions
                name="address.positions"
                label="Positions de l’adresse"
                hintText="La premiere est la position principale de l’adresse"
                placeholder="Nom du lieu-dit"
                values={addressPositions}
                initValues={addressPositions[0] as Position}
                onChange={positions => setAddressPositions(positions)}
                isRequired
              />
            )
          : (
              <Button
                type="button"
                onClick={() => setAddressPositions([...addressPositions, { type: '', lng: addressPositions[0].lng || null, lat: addressPositions[0].lat || null }])}
                iconId="fr-icon-add-line"
                priority="tertiary no outline"
                size="small"
              >
                Ajouter une position
              </Button>
            )}
      </div>
    </FormDiffSection>
  )
}

export default FormBanAddress
