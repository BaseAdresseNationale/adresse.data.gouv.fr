'use client'

import MoissonneurBal from '@/components/Partenaires/Moissonnage/MoissonneurBAL'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'
import Tabs from '@codegouvfr/react-dsfr/Tabs'
import { useState } from 'react'
import APIDepot from './APIDepot/APIDepot'

interface PartenaireOrganismeProps {
  partenaireDeLaCharte: PartenaireDeLaChartType
  availableTabs: { tabId: string, label: string }[]
}

export default function PartenaireOrganisme({ partenaireDeLaCharte, availableTabs }: PartenaireOrganismeProps) {
  const [selectedTabId, setSelectedTabId] = useState(availableTabs[0]?.tabId || '')

  return (
    <div className="fr-container fr-py-5w">
      <p>{partenaireDeLaCharte.name} mutualise la production et la diffusion des Bases Adresses Locales (BAL).</p>
      <Tabs
        selectedTabId={selectedTabId}
        tabs={availableTabs}
        onTabChange={setSelectedTabId}
      >
        {selectedTabId === 'api-depot' && <APIDepot partenaireDeLaCharte={partenaireDeLaCharte} /> }
        {selectedTabId === 'moissonnage' && <MoissonneurBal partenaireDeLaCharte={partenaireDeLaCharte} /> }
      </Tabs>
    </div>
  )
}
