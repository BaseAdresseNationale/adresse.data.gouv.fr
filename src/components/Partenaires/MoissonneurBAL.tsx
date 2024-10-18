import Badge from '@codegouvfr/react-dsfr/Badge'
import MoissonneurHarvestList from './moissonneur-harvest/MoissonneurHarvestList'
import { ExtendedSourceMoissoneurType } from '@/types/api-moissonneur-bal.types'

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
          <section key={source._id} className="fr-accordion">
            <h4 className="fr-accordion__title">
              <button
                type="button"
                className="fr-accordion__btn"
                aria-expanded="false"
                aria-controls={`accordion-${source._id}`}
              >
                <div className="accordion-header">
                  <p>{source.title}</p>
                  <div>
                    {source._deleted
                      ? (
                          <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
                            Supprimé
                          </Badge>
                        )
                      : (source.enabled
                          ? (
                              <Badge severity="success" style={{ marginRight: 2, marginBottom: 2 }}>
                                Activé
                              </Badge>
                            )
                          : (
                              <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
                                Désactivé
                              </Badge>
                            ))}
                    {(source.harvestError || (source.nbRevisionError && source.nbRevisionError > 0))
                      ? (
                          <Badge severity="error" style={{ marginRight: 2, marginBottom: 2 }}>
                            Erreur(s)
                          </Badge>
                        )
                      : (
                          <Badge severity="success" style={{ marginRight: 2, marginBottom: 2 }}>
                            Aucune Erreur
                          </Badge>
                        )}
                  </div>
                </div>

              </button>
            </h4>
            <div className="fr-collapse" id={`accordion-${source._id}`}>
              <MoissonneurHarvestList sourceId={source._id} />
              {/* <MoissonneurRevisionsList sourceId={source._id} /> */}
            </div>
          </section>
        ))}
      </div>

    </section>
  )
}
