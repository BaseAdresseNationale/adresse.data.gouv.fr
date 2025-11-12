import { findCommuneName } from '@/utils/cog'
import { formatDate } from '@/utils/date'
import { getFileLink } from '@/lib/api-moissonneur-bal'
import Button from '@codegouvfr/react-dsfr/Button'
import { PublicationMoissoneurType, RevisionMoissoneurType, RevisionStatusMoissoneurEnum } from '@/types/api-moissonneur-bal.types'
import { Revision } from '@/types/api-depot.types'
import { useEffect, useState } from 'react'
import { getCurrentRevision } from '@/lib/api-depot'
import StatusBadgeRevision from './StatusBadgeRevision'
import RevisionValidationPopup from './RevisionValidationPopup'

export interface RevisionPublicationProps {
  publicationMoissoneur: PublicationMoissoneurType
  revisionApiDepot?: Revision
}

export default function MoissonneurRevisionItem({ id, codeCommune, createdAt, validation, updateStatus, updateRejectionReason, publication, fileId }: RevisionMoissoneurType) {
  const [revision, setRevision] = useState<Revision | undefined>(undefined)

  useEffect(() => {
    const fetchRevision = async () => {
      if (codeCommune) {
        const results = await getCurrentRevision(codeCommune)
        setRevision(results)
      }
    }

    fetchRevision()
  }, [codeCommune])

  return (
    <tr>
      <td className="fr-col fr-my-1v">
        <p>{findCommuneName(codeCommune)} ({codeCommune})</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{formatDate(createdAt)}</p>
      </td>
      <td className="fr-col fr-my-1v">
        {validation && <RevisionValidationPopup id={id} fileId={fileId!} validation={validation} />}
      </td>
      <td className="fr-col fr-my-1v">
        {publication && <StatusBadgeRevision updateStatus={updateStatus} updateRejectionReason={updateRejectionReason} publicationMoissoneur={publication} revisionApiDepot={revision} />}
      </td>
      <td className="fr-col fr-my-1v">
        {fileId && <Button linkProps={{ href: getFileLink(fileId) }}>Télécharger</Button>}
      </td>
    </tr>
  )
}
