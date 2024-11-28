import Link from 'next/link'
import PanelMicroToponymAddressList from './PanelMicroToponymAddressList'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface PanelMicroToponymProps {
  microToponym: TypeMicroToponymExtended
}

function PanelMicroToponym({ microToponym }: PanelMicroToponymProps) {
  return (
    <>
      <div>
        <Link
          href={`./commune/${microToponym.commune.code}`}
          className="fr-link fr-link--icon-right fr-icon-arrow-right-line"
        >
          En savoir plus sur la commune de {microToponym.commune.nom}
        </Link>
      </div>

      <PanelMicroToponymAddressList microToponym={microToponym} />
    </>
  )
}

export default PanelMicroToponym
