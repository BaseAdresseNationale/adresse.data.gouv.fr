import { useState, useMemo, useEffect } from 'react'
import { Button } from '@codegouvfr/react-dsfr/Button'

import FormBanLabels from './FormBanLabels'
import {
  FormDiffSection,
  FormDiffFooter,
} from './FormDiffBan.styles'

import type { FormBanLabelsProps } from './FormBanLabels'

interface labels {
  isoCode: string
  value: string
}

interface DistrictBanLegacy {
  id: string
  nom: string
  nomAlt?: string
  code?: string
  banId?: string
}

interface FormBanDistrictProps extends FormBanLabelsProps {
  children?: React.ReactNode
  district: DistrictBanLegacy
}

function FormBanDistrict({ children, district: legacyDistrict, onChange }: FormBanDistrictProps) {
  const labels = useMemo(() => (
    (legacyDistrict?.nom)
      ? [{ isoCode: 'fra', value: legacyDistrict.nom }]
      : []
  ).concat(
    (legacyDistrict?.nomAlt)
      ? Object.entries(legacyDistrict?.nomAlt).map(([isoCode, value]) => ({ isoCode, value }))
      : []
  ), [legacyDistrict])
  const [districtLabels, setDistrictLabels] = useState<labels[]>(labels)

  useEffect(() => {
    if (onChange) onChange(districtLabels)
  }, [districtLabels, onChange])

  return (
    <FormDiffSection>
      {children}
      <input type="hidden" value={legacyDistrict?.banId} name="district.id" />
      <pre>{legacyDistrict?.nom} (cog {legacyDistrict?.code})</pre>
      {/* <FormBanLabels name="district.Labels" values={labels} onChange={(labels) => setDistrictLabels(labels)} /> */}

      <FormDiffFooter>
        <Button
          type="button"
          // onClick={() => setAddressLabels([...addressLabels, { isoCode: defaultLang, value: '' }])}
          iconId="ri-arrow-left-right-line"
          priority="secondary"
          size="small"
        >
          Remplacer
        </Button>
      </FormDiffFooter>

    </FormDiffSection>
  )
}

export default FormBanDistrict
