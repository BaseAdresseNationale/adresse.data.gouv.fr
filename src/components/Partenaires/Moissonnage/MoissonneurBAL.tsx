import Badge from '@codegouvfr/react-dsfr/Badge'
import MoissonneurHarvestList from './moissonneur-harvest/MoissonneurHarvestList'
import { ExtendedSourceMoissoneurType } from '@/types/api-moissonneur-bal.types'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import MoissonneurRevisionsList from './moissonneur-revision/MoissonneurRevisionList'
import Section from '@/components/Section'
import { getOrganization, getOrganizationSources } from '@/lib/api-moissonneur-bal'
import { OrganizationMoissoneurType } from '@/types/api-moissonneur-bal.types'
import { PerimeterType } from '@/types/api-depot.types'
import { flattenDeep } from 'lodash'
import Perimeters from '../Perimeters'
import { PartenaireDeLaChartType } from '@/types/partenaire.types'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'

interface MoissonneurBalProps {
  partenaireDeLaCharte: PartenaireDeLaChartType
}

export default function MoissonneurBal({ partenaireDeLaCharte }: MoissonneurBalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [sources, setSources] = useState<ExtendedSourceMoissoneurType[]>([])
  const [aggregatedPerimeters, setAggregatedPerimeters] = useState<PerimeterType[]>([])

  useEffect(() => {
    async function fetchData() {
      if (!partenaireDeLaCharte.dataGouvOrganizationId || partenaireDeLaCharte.dataGouvOrganizationId.length === 0) {
        throw new Error('No dataGouvOrganizationId')
      }
      const moissonneur = {
        organizations: [] as OrganizationMoissoneurType[],
        sources: [] as ExtendedSourceMoissoneurType[],
      }
      for (const orgaId of partenaireDeLaCharte.dataGouvOrganizationId) {
        moissonneur.organizations.push(await getOrganization(orgaId))
        moissonneur.sources.push(...(await getOrganizationSources(orgaId)))
      }
      const aggregatePerimeters: PerimeterType[] = flattenDeep(moissonneur.organizations.map(({ perimeters }) => perimeters) as any)
      setAggregatedPerimeters(aggregatePerimeters)
      setSources(moissonneur.sources)
      setIsLoading(false)
    }
    fetchData()
  }, [partenaireDeLaCharte])

  return isLoading
    ? <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '200px', alignItems: 'center' }}><Loader size={50} /></div>
    : (
        <Section title="Publication de Bases Adresses Locales via moissonneur">
          <Perimeters perimeters={aggregatedPerimeters} style={{ marginBottom: '1rem' }} />
          <section>
            <p>Les fichiers BAL mis à disposition sont quotidiennement moissonnés sur la plateforme ouverte des données publiques françaises (data.gouv.fr).</p>
            <div className="fr-accordions-group">
              {sources.map(source => (
                <Accordion
                  id={source.id}
                  key={source.id}
                  label={(
                    <div>
                      <p style={{ marginBottom: 5 }}>{source.title}</p>
                      <div>
                        {source.deletedAt
                          ? (
                              <Badge severity="error" style={{ marginRight: 5, marginBottom: 2 }}>
                                Supprimé
                              </Badge>
                            )
                          : (source.enabled
                              ? (
                                  <Badge severity="success" style={{ marginRight: 5, marginBottom: 2 }}>
                                    Activé
                                  </Badge>
                                )
                              : (
                                  <Badge severity="error" style={{ marginRight: 5, marginBottom: 2 }}>
                                    Désactivé
                                  </Badge>
                                ))}
                        {(source.harvestError || (source.nbRevisionError && source.nbRevisionError > 0))
                          ? (
                              <Badge severity="error" style={{ marginRight: 5, marginBottom: 2 }}>
                                Erreur(s)
                              </Badge>
                            )
                          : (
                              <Badge severity="success" style={{ marginRight: 5, marginBottom: 2 }}>
                                Aucune Erreur
                              </Badge>
                            )}
                      </div>
                    </div>
                  )}
                >
                  <MoissonneurHarvestList sourceId={source.id} />
                  <MoissonneurRevisionsList sourceId={source.id} />
                </Accordion>
              ))}
            </div>
          </section>
        </Section>
      )
}
