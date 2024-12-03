import { useState, useMemo } from 'react'
import Link from 'next/link'
import { fr } from '@codegouvfr/react-dsfr'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'

import sortAddresses from '../../tools/sortAddresses'

import {
  MicroToponymAddressListInfo,
  MicroToponymAddressListTable,
  MicroToponymAddressLink,
} from './PanelMicroToponymAddressList.styles'

import type { SortAddressesEntry } from '../../tools/sortAddresses'
import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'
import { env } from 'next-runtime-env'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

interface PanelMicroToponymAddressListProps {
  microToponym: TypeMicroToponymExtended
}

function PanelMicroToponymAddressList({ microToponym }: PanelMicroToponymAddressListProps) {
  const [isAddressUncertifiedVisible, setIsAddressUncertifiedVisible] = useState(true)
  const [isAddressCertifiedVisible, setIsAddressCertifiedVisible] = useState(true)
  const addressesUncertified = useMemo(
    () => microToponym?.numeros.filter(({ certifie }) => certifie === false) || []
    , [microToponym?.numeros])
  const addressesCertified = useMemo(
    () => microToponym?.numeros.filter(({ certifie }) => certifie === true) || []
    , [microToponym?.numeros])
  const addresses = useMemo(
    () => [
      ...(isAddressUncertifiedVisible ? addressesUncertified : []),
      ...(isAddressCertifiedVisible ? addressesCertified : []),
    ].sort((addrA, addrB) => sortAddresses(addrA as unknown as SortAddressesEntry, addrB as unknown as SortAddressesEntry))
    , [addressesCertified, addressesUncertified, isAddressCertifiedVisible, isAddressUncertifiedVisible])

  return (
    <>
      <h4>Adresses</h4>

      <MicroToponymAddressListInfo>
        Une adresse certifiée garantit aux utilisateurs de la Base Adresses Natinale que cette dernière est valide et existe bel et bien sur le territoire de la commune, à la position fournie.
      </MicroToponymAddressListInfo>

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
                      className={fr.cx('fr-icon-success-line')}
                      style={{ color: 'var(--artwork-major-blue-france)' }}
                      aria-hidden={true}
                    />
                  )
                : (
                    <span
                      className={fr.cx('fr-icon-error-line')}
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
    </>
  )
}

export default PanelMicroToponymAddressList
