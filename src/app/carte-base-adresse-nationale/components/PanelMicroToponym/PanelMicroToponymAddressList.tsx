import { Fragment, useState, useMemo, useEffect, useCallback } from 'react'
import { fr } from '@codegouvfr/react-dsfr'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Input } from '@codegouvfr/react-dsfr/Input'

import { getBanItem } from '@/lib/api-ban'

import sortAddresses from '../../tools/sortAddresses'

import {
  MicroToponymAddressListInfo,
  MicroToponymAddressListTable,
  MicroToponymAddressLink,
  ToggleWrapper,
  ClearInputButton,
} from './PanelMicroToponymAddressList.styles'

import type { SortAddressesEntry } from '../../tools/sortAddresses'
import type { TypeMicroToponymExtended, TypeAddress } from '../../types/LegacyBan.types'
import { env } from 'next-runtime-env'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

interface PanelMicroToponymAddressListProps {
  microToponym: TypeMicroToponymExtended
}

interface TypeMicroToponymValue {
  MicroToponym: TypeMicroToponymExtended
  addresses: TypeAddress[]
}

type ToponymesEntry = [string, TypeMicroToponymValue]

function PanelMicroToponymAddressList({ microToponym }: PanelMicroToponymAddressListProps) {
  const [isAddressUncertifiedVisible, setIsAddressUncertifiedVisible] = useState(true)
  const [isAddressCertifiedVisible, setIsAddressCertifiedVisible] = useState(true)
  const [subMicroToponyms, setSubMicroToponyms] = useState<ToponymesEntry[]>([])
  const [filter, setFilter] = useState<Record<string, string>>({})

  const microToponymId = microToponym?.idVoie

  const addressesUncertified = useMemo(
    () => microToponym?.numeros.filter(({ certifie }) => certifie === false) || []
    , [microToponym?.numeros])
  const addressesCertified = useMemo(
    () => microToponym?.numeros.filter(({ certifie }) => certifie === true) || []
    , [microToponym?.numeros])

  const handelFilter = useCallback((topoId: string, search: string) => {
    const { [topoId]: id, ...initFilter } = filter
    setFilter({ ...initFilter, ...(search && { [topoId]: search }) })
  }, [filter])

  const deburr = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  useEffect(() => {
    (async () => {
      const addressesGroup = [
        ...(isAddressUncertifiedVisible ? addressesUncertified : []),
        ...(isAddressCertifiedVisible ? addressesCertified : []),
      ]
        .reduce(
          (
            acc: Record<string, TypeAddress[]>,
            entry,
          ) => {
            const mainTopoId = (entry.idVoie || microToponymId) as string
            acc[mainTopoId] = [
              ...(acc?.[mainTopoId] || []),
              entry,
            ]
            return acc
          },
          {}
        )

      const _subMicroToponyms = await Promise.all(
        Object.entries(addressesGroup).map(async ([topoId]) => {
          const banItem = await getBanItem(topoId)
          return [
            topoId,
            {
              MicroToponym: banItem,
              addresses: addressesGroup[topoId]
                .filter(address => (filter[topoId])
                  ? deburr(String(`${address.numero}${address.suffixe}`))
                    .includes(deburr(filter[topoId].replace(/\s/g, '')))
                  : true
                )
                .sort((addrA, addrB) => sortAddresses(addrA as unknown as SortAddressesEntry, addrB as unknown as SortAddressesEntry)),
            },
          ]
        })
      ) as unknown as ToponymesEntry[]

      _subMicroToponyms.sort(([topoId_A, { MicroToponym: { nomVoie: nomVoie_A } }], [topoId_B, { MicroToponym: { nomVoie: nomVoie_B } }]) => {
        if (topoId_A === microToponymId) return -1
        if (topoId_B === microToponymId) return 1
        return String(nomVoie_A || '').localeCompare(String(nomVoie_B || ''))
      })

      setSubMicroToponyms(_subMicroToponyms)
    })()
  },
  [
    microToponymId,
    addressesCertified,
    addressesUncertified,
    isAddressCertifiedVisible,
    isAddressUncertifiedVisible,
    filter,
  ])

  return (
    <>
      <h4>Adresses</h4>

      <MicroToponymAddressListInfo>
        Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.
      </MicroToponymAddressListInfo>

      <ToggleWrapper>
        <ToggleSwitch
          label={<>{addressesUncertified.length} {addressesUncertified.length > 1 ? 'Adresses non certifiées' : 'Adresse non certifiée'}</>}
          labelPosition="right"
          inputTitle="terms"
          showCheckedHint={false}
          checked={isAddressUncertifiedVisible}
          onChange={checked => setIsAddressUncertifiedVisible(checked)}
        />

        <ToggleSwitch
          label={<>{addressesCertified.length} {addressesCertified.length > 1 ? 'Adresses certifiées' : 'Adresse certifiée'}</>}
          labelPosition="right"
          inputTitle="terms"
          showCheckedHint={false}
          checked={isAddressCertifiedVisible}
          onChange={checked => setIsAddressCertifiedVisible(checked)}
        />
      </ToggleWrapper>

      {subMicroToponyms.map(([topoId, { MicroToponym, addresses }]) => (
        <Fragment key={topoId}>
          {(topoId !== microToponymId) && <h5>{MicroToponym.nomVoie}</h5>}
          <Input
            label=""
            addon={filter[topoId] && <ClearInputButton onClick={() => handelFilter(topoId, '')}>X</ClearInputButton>}
            iconId="fr-icon-search-line"
            nativeInputProps={{
              placeholder: 'Rechercher un numero',
              value: filter[topoId] || '',
              onChange: (evt: React.ChangeEvent<HTMLInputElement>) => {
                const search = evt.target.value
                handelFilter(topoId, search)
              },
            }}
          />
          <MicroToponymAddressListTable
            headers={[
              <>N° (
                <>
                  {addresses.length}{' '}
                  {addresses.length > 1 ? 'trouvés sur l’odonyme' : 'trouvé sur l’odonyme'}
                </>
                )
              </>,
              'Certif.',
            ]}
            data={
              addresses.map((address: any) => (
                [
                  <MicroToponymAddressLink key={address.id} href={`${URL_CARTOGRAPHY_BAN}?id=${address.id}`}>
                    <span>{address.numero}</span>
                    {address?.suffixe ? <span>{address.suffixe}</span> : <span>{' '}</span>}
                  </MicroToponymAddressLink>,
                  address?.certifie
                    ? (
                        <span
                          className={fr.cx('ri-checkbox-circle-fill')}
                          style={{ color: 'var(--text-default-success)' }}
                          aria-hidden={true}
                        />
                      )
                    : (
                        <span
                          className={fr.cx('fr-icon-error-fill')}
                          style={{ color: 'var(--artwork-major-red-marianne)' }}
                          aria-hidden={true}
                        />
                      ),
                ]
              ))
            }
            fixed={true}
            noScroll={true}
          />
        </Fragment>
      ))}

    </>
  )
}

export default PanelMicroToponymAddressList
