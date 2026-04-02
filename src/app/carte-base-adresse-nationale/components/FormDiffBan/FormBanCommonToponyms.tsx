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

interface ToponymBanLegacy {
  id: string
  idVoie: string
  nomVoie: string
  nomVoieAlt: Record<string, string>
  idBanDistrict?: string
  banId?: string
}

interface FormBanCommonToponymsProps extends FormBanLabelsProps {
  children?: React.ReactNode
  toponyms?: ToponymBanLegacy
}

function FormBanCommonToponyms({ children, toponyms: legacyToponyms, onChange }: FormBanCommonToponymsProps) {
  const toponymLabels = useMemo(() => (
    (legacyToponyms?.nomVoie)
      ? [{ isoCode: 'fra', value: legacyToponyms.nomVoie }]
      : []
  ).concat(
    (legacyToponyms?.nomVoieAlt)
      ? Object.entries(legacyToponyms?.nomVoieAlt).map(([isoCode, value]) => ({ isoCode, value }))
      : []
  ), [legacyToponyms])

  const [commonToponymLabels, setCommonToponymLabels] = useState<labels[]>(toponymLabels)
  const [toponymeAction, setToponymeAction] = useState<'create' | 'edit' | 'replace' | undefined>()

  useEffect(() => {
    if (onChange) onChange(commonToponymLabels)
  }, [commonToponymLabels, onChange])

  return (
    <FormDiffSection>
      {children}
      <input type="hidden" value={legacyToponyms?.banId} name="commonToponym.id" />
      <input type="hidden" value={legacyToponyms?.idBanDistrict} name="commonToponym.districtID" />

      {toponymeAction === 'edit' && (
        <>
          <FormBanLabels
            name="commonToponym.labels"
            values={toponymLabels}
            placeholder="Rue, place ou lieu-dit"
            onChange={labels => setCommonToponymLabels(labels)}
            isRequired
          />
        </>
      )}

      <FormDiffFooter>
        {toponymeAction
          ? (
              <Button
                type="button"
                onClick={() => setToponymeAction(undefined)}
                iconId="ri-arrow-go-back-line"
                priority="secondary"
                size="small"
              >
                Annuler
              </Button>
            )
          : (
              <>
                <Button
                  type="button"
                  onClick={() => setToponymeAction('edit')}
                  iconId="ri-file-edit-line"
                  priority="secondary"
                  size="small"
                >
                  Editer
                </Button>

                <Button
                  type="button"
                  onClick={() => setToponymeAction('replace')}
                  iconId="ri-arrow-left-right-line"
                  priority="secondary"
                  size="small"
                >
                  Remplacer
                </Button>
              </>
            )}
      </FormDiffFooter>
    </FormDiffSection>
  )
}

export default FormBanCommonToponyms
