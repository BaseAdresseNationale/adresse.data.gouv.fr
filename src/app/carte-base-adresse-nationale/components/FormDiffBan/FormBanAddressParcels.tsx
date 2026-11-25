import { useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import FormBanParcels from './FormBanParcels'

import {
  FormDiffSection,
  FormDiffFooter,
} from './FormDiffBan.styles'

import type { ParcelId } from './FormBanParcels'

function FormBanAddress({ children, address }: { children?: React.ReactNode, address: any }) {
  const initialAddressParcels = address?.parcelles || []
  const [addressParcels, setAddressParcels] = useState<ParcelId[]>(initialAddressParcels)
  const [parcelsAction, setParcelsAction] = useState<'edit' | undefined>()

  return (
    <FormDiffSection>
      {children}

      {addressParcels.length > 0
        ? (
            <FormBanParcels
              name="address.meta.dgfip.cadastre"
              label="Parcelles cadastrales"
              hintText="{{size}} identifiants DGFiP de parcelles liées à l'adresse"
              zeroSizePlaceholder="Aucun"
              placeholder="Identifiant de parcelle"
              values={addressParcels}
              onChange={labels => setAddressParcels(labels)}
              hasLabelOnly={!parcelsAction}
              isWithScroll
            />
          )
        : (
            <Button
              type="button"
              onClick={() => setAddressParcels([...addressParcels, '' as ParcelId])}
              iconId="fr-icon-add-line"
              priority="tertiary no outline"
              size="small"
            >
              Ajouter un identifiant de parcelle
            </Button>
          )}

      <FormDiffFooter>
        {parcelsAction
          ? (
              <Button
                type="button"
                onClick={() => setParcelsAction(undefined)}
                iconId="ri-arrow-go-back-line"
                priority="secondary"
                size="small"
              >
                Annuler
              </Button>
            )
          : (
              <Button
                type="button"
                onClick={() => setParcelsAction('edit')}
                iconId="ri-file-edit-line"
                priority="secondary"
                size="small"
              >
                Editer
              </Button>
            )}
      </FormDiffFooter>
    </FormDiffSection>
  )
}

export default FormBanAddress
