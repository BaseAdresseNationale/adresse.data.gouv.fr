import Badge from '@codegouvfr/react-dsfr/Badge'
import MoissonneurHarvestList from './moissonneur-harvest/MoissonneurHarvestList'
import { ExtendedSourceMoissoneurType } from '@/types/api-moissonneur-bal.types'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import MoissonneurRevisionsList from './moissonneur-revision/MoissonneurRevisionList'

interface MoissonneurBalProps {
  sources: ExtendedSourceMoissoneurType[]
}

export default function MoissonneurBal({ sources }: MoissonneurBalProps) {
  return (
    <section>
      <h3>Moissonnage</h3>
      <p>Les fichiers BAL mises à disposition sont quotidiennement moissonnées sur la plateforme ouvertes des données publiques françaises (data.gouv.fr).</p>
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
  )
}
