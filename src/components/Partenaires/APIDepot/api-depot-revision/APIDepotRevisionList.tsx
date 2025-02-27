'use client'

import APIDepotRevisionItem from './APIDepotRevisionItem'
import { Revision } from '@/types/api-depot.types'
import { createModal } from '@codegouvfr/react-dsfr/Modal'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Loader from '@/components/Loader'

interface APIDepotRevisionsListProps {
  revisions: Pick<Revision, 'id' | 'codeCommune' | 'status' | 'isCurrent' | 'publishedAt' | 'validation'>[]
}

const ValidationReportModal = createModal({
  id: 'validation-report-modal',
  isOpenedByDefault: false,
})

const DynamicValidationReportWithNoSSR = dynamic<{ validationReport: Revision['validation'] }>(
  () => import('./RevisionValidationReport'),
  { ssr: false, loading: () => <div style={{ display: 'flex', width: '100%', justifyContent: 'center', height: '400px', alignItems: 'center' }}><Loader size={50} /></div> }
)

function APIDepotRevisionsList({ revisions }: APIDepotRevisionsListProps) {
  const [validationReport, setShowValidationReport] = useState<Revision['validation'] | null>(null)

  const handleShowValidationReport = (report: Revision['validation']) => {
    setShowValidationReport(report)
    ValidationReportModal.open()
  }

  return (
    <>
      <section>
        <h5>Révisions par commune</h5>
        <p>Ici sont listés les dernières révisions créées par commune par ce client d&apos;API de dépôt.</p>
        <p><b> Si vous rencontrez un problème pour la publication d&apos;une commune, vous obtiendrez des informations sur les erreurs de publication en consultant le rapport de validation.</b></p>
        {(revisions && revisions.length > 0)
          ? (
              <div className="fr-table">
                <table>
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">Commune</th>
                      <th scope="col">Statut</th>
                      <th scope="col">Date de publication</th>
                      <th scope="col">Rapport de validation</th>
                      <th scope="col">Fichier</th>
                    </tr>
                  </thead>

                  <tbody>
                    {revisions.map(revision => (
                      <APIDepotRevisionItem key={revision.id} openValidationReport={handleShowValidationReport} {...revision} />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          : (
              <p>Aucune revision</p>
            )}
      </section>
      <ValidationReportModal.Component title="Rapport de validation">
        {validationReport && <DynamicValidationReportWithNoSSR validationReport={validationReport} />}
      </ValidationReportModal.Component>
    </>
  )
}

export default APIDepotRevisionsList
