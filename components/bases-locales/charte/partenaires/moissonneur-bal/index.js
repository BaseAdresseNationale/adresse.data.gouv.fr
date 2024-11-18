import PropTypes from 'prop-types'

import MoissonneurHarvestList from './harvests/harvests-list'
import MoissonneurRevisionsList from './revisions/revisions-list'
import Badge from '@codegouvfr/react-dsfr/Badge'

function MoissonneurBal({sources}) {
  return (
    <section>
      <h3>Moissonnage</h3>
      <p>Les fichiers BAL mises à disposition sont quotidiennement moissonnées sur la plateforme ouvertes des données publiques françaises (data.gouv.fr).</p>
      <div className='fr-accordions-group'>
        {sources.map(source => (
          <section key={source.id} className='fr-accordion'>
            <h4 className='fr-accordion__title'>
              <button
                type='button'
                className='fr-accordion__btn'
                aria-expanded='false'
                aria-controls={`accordion-${source.id}`}
              >
                <div className='accordion-header'>
                  <p>{source.title}</p>
                  <div>
                    {source.deletedAt ? (
                      <Badge severity='error' style={{marginRight: 2, marginBottom: 2}}>
                        Supprimé
                      </Badge>
                    ) : (source.enabled ? (
                      <Badge severity='success' style={{marginRight: 2, marginBottom: 2}}>
                        Activé
                      </Badge>
                    ) : (
                      <Badge severity='error' style={{marginRight: 2, marginBottom: 2}}>
                        Désactivé
                      </Badge>
                    ))}
                    {(source.harvestError || source.nbRevisionError > 0) ? (
                      <Badge severity='error' style={{marginRight: 2, marginBottom: 2}}>
                        Erreur(s)
                      </Badge>
                    ) : (
                      <Badge severity='success' style={{marginRight: 2, marginBottom: 2}}>
                        Aucune Erreur
                      </Badge>
                    )}
                  </div>
                </div>

              </button>
            </h4>
            <div className='fr-collapse' id={`accordion-${source.id}`}>
              <MoissonneurHarvestList sourceId={source.id} />
              <MoissonneurRevisionsList sourceId={source.id} />
            </div>
          </section>
        ))}
      </div>

      <style jsx>{`
 
        .fr-accordion {
          border: 1px solid grey;
          border-radius: 5px;
          margin: 1em 0;
        }
        .fr-accordion:after {
          content: none;
        }
        .fr-accordion:before {
          content: none;
        }
        .fr-accordion__btn {
          padding: 2em;
          font-size: 16px;
        }
        .accordion-header {
          width: 95%;
          display: flex;
          justify-content: space-between;
        }
        .fr-accordion__btn:hover {
          background: none !important;
        }
        .accordion {
          padding: 10px;
        }
      `}</style>
    </section>
  )
}

MoissonneurBal.propTypes = {
  sources: PropTypes.array.isRequired,
}

export default MoissonneurBal
