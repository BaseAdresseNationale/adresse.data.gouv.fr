import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Table } from '@codegouvfr/react-dsfr/Table'

import { DistrictMicroToponymListInfo } from './PanelDistrictMicroToponymList.styles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'
import { env } from 'next-runtime-env'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

interface PanelDistrictMicroToponymListProps {
  district: TypeDistrictExtended
}

const sortMicroToponymes = (
  { nomVoie: nomVoieA }: { nomVoie: string },
  { nomVoie: nomVoieB }: { nomVoie: string },
) => (nomVoieA.localeCompare(nomVoieB))

const testMicroTopoWithAddress = ({ nbNumeros }: { nbNumeros: number }) => nbNumeros && nbNumeros > 0
const testMicroTopoWithoutAddress = ({ nbNumeros }: { nbNumeros: number }) => !nbNumeros || nbNumeros === 0

function PanelDistrictMicroToponymList({ district }: PanelDistrictMicroToponymListProps) {
  const [isMicroTopoWithAddressVisible, setIsMicroTopoWithAddressVisible] = useState(true)
  const [isMicroTopoWithoutAddressVisible, setIsMicroTopoWithoutAddressVisible] = useState(true)

  const MicroTopoWithAddress = useMemo(
    () => (district?.voies || []).filter(testMicroTopoWithAddress).toSorted(sortMicroToponymes)
    , [district?.voies])
  const MicroTopoWithoutAddress = useMemo(
    () => (district?.voies || []).filter(testMicroTopoWithoutAddress).toSorted(sortMicroToponymes)
    , [district?.voies])

  const microToponymes = useMemo(() =>
    [
      ...(isMicroTopoWithAddressVisible ? MicroTopoWithAddress : []),
      ...(isMicroTopoWithoutAddressVisible ? MicroTopoWithoutAddress : []),
    ].toSorted(sortMicroToponymes)
  , [
    MicroTopoWithAddress,
    MicroTopoWithoutAddress,
    isMicroTopoWithAddressVisible,
    isMicroTopoWithoutAddressVisible,
  ])

  return (
    <>
      <h4 data-prefix="Odonymes">
        Voies, places et lieux-dits
      </h4>

      <DistrictMicroToponymListInfo>
        Les odonymes correspondent aux voies, places, lieux-dits, et autres micro-toponymes circulables et/ou porteurs d’adresses.
      </DistrictMicroToponymListInfo>
      <ToggleSwitch
        label={<>{MicroTopoWithAddress.length} odonymes avec adresses</>}
        labelPosition="right"
        inputTitle="terms"
        showCheckedHint={false}
        checked={isMicroTopoWithAddressVisible}
        onChange={checked => setIsMicroTopoWithAddressVisible(checked)}
      />
      <ToggleSwitch
        label={<>{MicroTopoWithoutAddress.length} odonymes sans adresse</>}
        labelPosition="right"
        inputTitle="terms"
        showCheckedHint={false}
        checked={isMicroTopoWithoutAddressVisible}
        onChange={checked => setIsMicroTopoWithoutAddressVisible(checked)}
      />

      <Table
        headers={[
          <>Odonyme ({microToponymes.length})</>,
          'Adresse',
        ]}
        data={
          microToponymes.map((voie: any) => (
            [
              <span key={voie.id}>
                <Link href={`${URL_CARTOGRAPHY_BAN}?id=${voie.id}`}>{voie.nomVoie}</Link>
              </span>,
              voie?.nbNumeros || 0,
            ]
          ))
        }
        noScroll={true}
      />
    </>
  )
}

export default PanelDistrictMicroToponymList
