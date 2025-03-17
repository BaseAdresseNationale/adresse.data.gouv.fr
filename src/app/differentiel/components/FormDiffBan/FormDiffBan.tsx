import { useMemo, useCallback, useState } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import FormBanAddress from './FormBanAddress'
import FormBanAddressParcels from './FormBanAddressParcels'
import FormBanCommonToponyms from './FormBanCommonToponyms'
import FormBanDistrict from './FormBanDistrict'

import {
  FormWrapper,
  FormDiffFooter,
  IdWrapper,
} from './FormDiffBan.styles'

import {
  formDataToJson,
  formatMongoToBAN,
  FormResultToBanDiff,
  banFormatToFormDataResult,
} from './helpers'

import type {
  BANFormat,
  DiffBAN,
  FormDataResult,
} from './helpers'

interface FormObject {
  username: string
  email: string
}

interface FormDiffBanProps {
  form?: FormObject
  banItem: any
}

function FormDiffBan({ form, banItem }: FormDiffBanProps) {
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement> | React.FormEvent<HTMLButtonElement>): void => {
    event.preventDefault()

    // === Step ===

    // 1️⃣ Récupérer les données MongoDB et les formater en BAN
    const mongoData = banItem
    const formattedBAN: BANFormat = formatMongoToBAN(mongoData)

    // 2️⃣ Convertir `BANFormat` en `FormDataResult` (pour pouvoir comparer après modif)
    const oldFormattedData: FormDataResult = banFormatToFormDataResult(formattedBAN)

    // 3️⃣ Reccuperation des données du formulaire
    const form = (event.target as HTMLButtonElement).closest('form') as HTMLFormElement
    const formData = new FormData(form)
    const formDataJson: FormDataResult = formDataToJson(formData)

    // 4️⃣ Générer le DiffBAN avec les anciennes valeurs
    function deepMerge(target: any, source: any) {
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          if (source[key] instanceof Object && key in target) {
            deepMerge(target[key], source[key])
          }
          else if (!(key in target)) {
            target[key] = source[key]
          }
        }
      }
      return target
    }
    const formDataJsonComplete = deepMerge(formDataJson, oldFormattedData)
    const diffBAN: DiffBAN = FormResultToBanDiff('updated', formDataJsonComplete, oldFormattedData)

    console.log('📌 DiffBAN :', JSON.stringify(diffBAN, null, 2), diffBAN)
  }, [banItem])

  const commonToponym = useMemo(() => ({
    ...banItem?.voie,
    idBanDistrict: banItem?.banIdDistrict,
    banId: banItem?.banIdMainCommonToponym,
  }), [banItem])

  const district = useMemo(() => ({
    ...banItem?.commune,
    banId: banItem?.banIdDistrict,
  }), [banItem])

  if (banItem) console.log(JSON.stringify(banItem, null, 2))

  return (
    <FormWrapper>
      <FormBanAddress address={banItem}>
        <h4>Adresse</h4>
        <IdWrapper>
          BanID Address : <pre>{banItem?.banId}</pre>
          <input type="hidden" value={banItem?.banId} name="idBanAddress" />
        </IdWrapper>
      </FormBanAddress>

      <FormBanAddressParcels address={banItem} />

      <FormBanCommonToponyms
        toponyms={commonToponym}
        onChange={values => console.log(JSON.stringify(values))}
      >
        <b>Odonyme principal</b>
        <IdWrapper>
          BanID Common-Toponym : <pre>{banItem?.banIdMainCommonToponym}</pre>
          <input type="hidden" value={banItem?.banIdMainCommonToponym} name="idBanMainCommonToponym" />
        </IdWrapper>
      </FormBanCommonToponyms>

      <FormBanDistrict district={district}>
        <b>Commune</b>
        <IdWrapper>
          BanID District : <pre>{banItem?.banIdDistrict}</pre>
          <input type="hidden" value={banItem?.banIdDistrict} name="idBanDistrict" />
        </IdWrapper>
      </FormBanDistrict>

      <FormDiffFooter>
        <Button type="submit" onClick={handleSubmit}>Envoyer la proposition</Button>
      </FormDiffFooter>
    </FormWrapper>
  )
}

export default FormDiffBan
