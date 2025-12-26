import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { env } from 'next-runtime-env'
import { ToggleSwitch } from '@codegouvfr/react-dsfr/ToggleSwitch'
import { Table } from '@codegouvfr/react-dsfr/Table'
import { Input } from '@codegouvfr/react-dsfr/Input'

import { DistrictMicroToponymListInfo, ClearInputButton } from './PanelDistrictMicroToponymList.styles'

import type { TypeDistrictExtended } from '../../types/LegacyBan.types'

const URL_CARTOGRAPHY_BAN = env('NEXT_PUBLIC_URL_CARTOGRAPHY_BAN')

interface PanelDistrictMicroToponymListProps {
  district: TypeDistrictExtended
}

const sortMicroToponymes = (
  { nomVoie: nomVoieA }: { nomVoie: string },
  { nomVoie: nomVoieB }: { nomVoie: string },
) => (nomVoieA.localeCompare(nomVoieB))

const deburr = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const testMicroTopoWithAddress = ({ nbNumeros }: { nbNumeros: number }) => nbNumeros && nbNumeros > 0
const testMicroTopoWithoutAddress = ({ nbNumeros }: { nbNumeros: number }) => !nbNumeros || nbNumeros === 0

function PanelDistrictMicroToponymList({ district }: PanelDistrictMicroToponymListProps) {
  const microToponymes = useMemo(() => (district?.voies || []).toSorted(sortMicroToponymes), [district])
  const [isMicroTopoWithAddressVisible, setIsMicroTopoWithAddressVisible] = useState(true)
  const [isMicroTopoWithoutAddressVisible, setIsMicroTopoWithoutAddressVisible] = useState(true)
  const [filtredMicroToponymes, setFiltredMicroToponymes] = useState(microToponymes)
  const [search, setSearch] = useState('')

  const MicroTopoWithAddress = useMemo(
    () => filtredMicroToponymes.filter(testMicroTopoWithAddress)
    , [filtredMicroToponymes])
  const MicroTopoWithoutAddress = useMemo(
    () => filtredMicroToponymes.filter(testMicroTopoWithoutAddress)
    , [filtredMicroToponymes])

  const visibleMicroToponymes = useMemo(
    () => [
      ...(isMicroTopoWithAddressVisible ? MicroTopoWithAddress : []),
      ...(isMicroTopoWithoutAddressVisible ? MicroTopoWithoutAddress : []),
    ]
    , [
      MicroTopoWithAddress,
      MicroTopoWithoutAddress,
      isMicroTopoWithAddressVisible,
      isMicroTopoWithoutAddressVisible,
    ])

  function handleSearch(param: string) {
    if (search === '') {
      setFiltredMicroToponymes(microToponymes)
    }
    else {
      const voies = microToponymes.filter(
        (voie: any) => deburr(voie.nomVoie.toLowerCase())
          .includes(deburr(search.toLowerCase()))
      ).sort(
        // Sort by position of 'search value' in each word of the name
        (voieA: any, voieB: any) => {
          const nameA = deburr(voieA.nomVoie.toLowerCase())
          const nameB = deburr(voieB.nomVoie.toLowerCase())
          const searchLower = deburr(search.toLowerCase())
          const positionA = nameA.split(' ').map((word: string) => word.indexOf(searchLower)).sort().filter((position: number) => position !== -1)
          const positionB = nameB.split(' ').map((word: string) => word.indexOf(searchLower)).sort().filter((position: number) => position !== -1)
          if (positionA.length === 0 && positionB.length === 0) return 0
          if (positionA.length === 0) return 1
          if (positionB.length === 0) return -1
          return positionA[0] - positionB[0]
        }
      )
      setFiltredMicroToponymes(voies)
    }
  }
  

  return (
    <>
      <h4 data-prefix="Odonymes">
        Voies, places et lieux-dits
      </h4>

      <DistrictMicroToponymListInfo>
        Les odonymes correspondent aux voies, places, lieux-dits, et autres micro-toponymes circulables et/ou porteurs d’adresses.
      </DistrictMicroToponymListInfo>

      <Input
        label="Filtrer les odonymes"
        iconId="fr-icon-search-line"
        addon={search && <ClearInputButton onClick={() => handleSearch('')}>X</ClearInputButton>}
        nativeInputProps={{
          placeholder: 'Nom de voie, place ou lieu-dit',
          value: search,
          onChange: (evt: React.ChangeEvent<HTMLInputElement>) => handleSearch(evt.target.value),
        }}
      />

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
          <>Odonyme ({visibleMicroToponymes.length})</>,
          'Adresse',
        ]}
        data={
          visibleMicroToponymes.map((voie: any) => (
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
