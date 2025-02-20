import { findCommuneName } from '@/utils/cog'
import { formatDate } from '@/utils/date'
import Button from '@codegouvfr/react-dsfr/Button'
import { Revision } from '@/types/api-depot.types'
import { getRevisionDownloadUrl } from '@/lib/api-depot'
import Tooltip from '@/components/Tooltip'

interface APIDepotRevisionItemProps {
  id: string
  codeCommune: string
  validation: Revision['validation']
  isCurrent: boolean
  publishedAt: string
}

export default function APIDepotRevisionItem({ id, codeCommune, validation, isCurrent, publishedAt }: APIDepotRevisionItemProps) {
  return (
    <tr>
      <td className="fr-col fr-my-1v">
        {isCurrent ? <Tooltip message="Révision courante"><span className="fr-icon-success-line" aria-hidden="true" /></Tooltip> : ''}
      </td>
      <td className="fr-col fr-my-1v">
        <p>{findCommuneName(codeCommune)} ({codeCommune})</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{formatDate(publishedAt)}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <p>{`${validation.rowsCount} / ${validation.errors.length}`}</p>
      </td>
      <td className="fr-col fr-my-1v">
        <Button linkProps={{ href: getRevisionDownloadUrl(id) }}>Télécharger</Button>
      </td>
    </tr>
  )
}
