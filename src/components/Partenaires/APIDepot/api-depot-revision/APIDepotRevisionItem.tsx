import { findCommuneName } from '@/utils/cog'
import Button from '@codegouvfr/react-dsfr/Button'
import { Revision } from '@/types/api-depot.types'
import { getRevisionDownloadUrl } from '@/lib/api-depot'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Tooltip from '@codegouvfr/react-dsfr/Tooltip'

interface APIDepotRevisionItemProps {
  id: string
  codeCommune: string
  validation: Revision['validation']
  isCurrent: boolean
  publishedAt: string | null
  status: string
  openValidationReport: (validation: Revision['validation']) => void
}

export default function APIDepotRevisionItem({ id, codeCommune, validation, isCurrent, publishedAt, status, openValidationReport }: APIDepotRevisionItemProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <Badge severity="success">Publiée</Badge>
        )
      default:
        return (
          <Tooltip title={(validation?.errors?.length || 0) > 0 ? 'Des erreurs de validations empêchent la publication, pour en savoir plus veuillez consulter le rapport de validation' : 'La révision est en attente de publication'}>
            <Badge severity={(validation?.errors?.length || 0) > 0 ? 'error' : 'warning'}>Non publiée</Badge>
          </Tooltip>
        )
    }
  }

  return (
    <tr>
      <td className="fr-col fr-my-1v">
        {isCurrent ? <Tooltip title="Révision courante"><span className="fr-icon-success-line" aria-hidden="true" /></Tooltip> : ''}
      </td>
      <td className="fr-col fr-my-1v">
        <p>{findCommuneName(codeCommune)} ({codeCommune})</p>
      </td>
      <td className="fr-col fr-my-1v">
        {getStatusBadge(status)}
      </td>
      <td className="fr-col fr-my-1v">
        {publishedAt
          ? new Date(publishedAt).toLocaleDateString('fr', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })
          : ''}
      </td>
      <td className="fr-col fr-my-1v">
        {validation && <Button type="button" onClick={() => openValidationReport(validation)}>Ouvrir</Button>}
      </td>
      <td className="fr-col fr-my-1v">
        {publishedAt && <Button linkProps={{ href: getRevisionDownloadUrl(id) }}>Télécharger</Button>}
      </td>
    </tr>
  )
}
