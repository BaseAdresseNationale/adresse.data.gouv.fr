import Accordion from '@codegouvfr/react-dsfr/Accordion'
import Section from '@/components/Section'
import { ClientsWithChefDeFileAndRevisions } from '@/types/api-depot.types'
import Perimeters from '../Perimeters'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'
import { getClientWithChefDeFile, getFirstRevisionsByClient } from '@/lib/api-depot'
import APIDepotRevisionsList from './api-depot-revision/APIDepotRevisionList'

interface APIDepotProps {
  partenaireDeLaCharte: PartenaireDeLaChartType
}

export default function APIDepot({ partenaireDeLaCharte }: APIDepotProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [clients, setClients] = useState<ClientsWithChefDeFileAndRevisions[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!partenaireDeLaCharte.apiDepotClientId || partenaireDeLaCharte.apiDepotClientId.length === 0) {
        throw new Error('No apiDepotClientId')
      }
      const _clients = []
      for (const clientId of partenaireDeLaCharte.apiDepotClientId) {
        const client = await getClientWithChefDeFile(clientId)
        const revisions = await getFirstRevisionsByClient(clientId)
        _clients.push({
          ...client,
          revisions,
        })
      }
      setClients(_clients)
      setIsLoading(false)
    }
    fetchData()
  }, [partenaireDeLaCharte])

  return isLoading
    ? <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '200px', alignItems: 'center' }}><Loader size={50} /></div>
    : (
        <Section title="Publication de Bases Adresse Locale via API">
          <section>
            <div className="fr-accordions-group">
              {clients.map(client => (
                <Accordion
                  id={client.id}
                  key={client.id}
                  label={(
                    <div>
                      <p style={{ marginBottom: 5 }}>{client.nom}</p>
                    </div>
                  )}
                >
                  {client.chefDeFile.perimeters && <Perimeters perimeters={client.chefDeFile.perimeters} style={{ marginBottom: '1rem' }} />}
                  <APIDepotRevisionsList revisions={client.revisions} />
                </Accordion>
              ))}
            </div>
          </section>
        </Section>
      )
}
