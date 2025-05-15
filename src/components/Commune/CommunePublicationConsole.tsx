'use client'

import { useState } from 'react'
import Section from '../Section'
import Tabs from '@codegouvfr/react-dsfr/Tabs'
import APIDepot from '../Partenaires/APIDepot/APIDepot'
import MoissonneurBal from '../Partenaires/Moissonnage/MoissonneurBAL'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'

interface CommunePublicationConsoleProps {
  partenaireDeLaCharte: PartenaireDeLaChartType
  tabs: { tabId: string, label: string }[]
}

export function CommunePublicationConsole({ partenaireDeLaCharte, tabs }: CommunePublicationConsoleProps) {
  const [selectedTabId, setSelectedTabId] = useState(tabs[0]?.tabId || '')

  return (
    <Section title="Console de publication">
      <Tabs
        selectedTabId={selectedTabId}
        tabs={tabs}
        onTabChange={setSelectedTabId}
      >
        {selectedTabId === 'api-depot' && <APIDepot partenaireDeLaCharte={partenaireDeLaCharte} /> }
        {selectedTabId === 'moissonnage' && <MoissonneurBal partenaireDeLaCharte={partenaireDeLaCharte} /> }
      </Tabs>
    </Section>
  )
}
