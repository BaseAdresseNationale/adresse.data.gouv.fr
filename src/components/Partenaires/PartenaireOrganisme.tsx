'use client'

import MoissonneurBal from '@/components/Partenaires/Moissonnage/MoissonneurBAL'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'
import Tabs from '@codegouvfr/react-dsfr/Tabs'
import { useMemo, useState } from 'react'
import APIDepot from './APIDepot/APIDepot'

interface PartenaireOrganismeProps {
  partenaireDeLaCharte: PartenaireDeLaChartType
}

export default function PartenaireOrganisme({ partenaireDeLaCharte }: PartenaireOrganismeProps) {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const tabs = useMemo(() => {
    const _tabs = []
    if (partenaireDeLaCharte.apiDepotClientId && partenaireDeLaCharte.apiDepotClientId.length > 0) {
      _tabs.push({ tabId: 'api-depot', label: 'API-dépôt', content: <APIDepot partenaireDeLaCharte={partenaireDeLaCharte} /> })
    }
    if (partenaireDeLaCharte.dataGouvOrganizationId && partenaireDeLaCharte.dataGouvOrganizationId.length > 0) {
      _tabs.push({ tabId: 'moissonnage', label: 'Moissonnage', content: <MoissonneurBal partenaireDeLaCharte={partenaireDeLaCharte} /> })
    }

    return _tabs
  }, [partenaireDeLaCharte])

  const selectedTabId = tabs[selectedTabIndex]?.tabId

  return (
    <div className="fr-container fr-py-5w">
      <p>{partenaireDeLaCharte.name} mutualise la production et la diffusion des Bases Adresses Locales (BAL).</p>
      <Tabs
        selectedTabId={selectedTabId}
        tabs={tabs}
        onTabChange={(tabId: string) => setSelectedTabIndex(tabs.findIndex(tab => tab.tabId === tabId))}
      >
        {tabs[selectedTabIndex]?.content}
      </Tabs>
    </div>
  )
}
