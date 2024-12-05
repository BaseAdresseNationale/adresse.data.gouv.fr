import PanelMicroToponymAddressList from './PanelMicroToponymAddressList'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

interface PanelMicroToponymProps {
  microToponym: TypeMicroToponymExtended
}

function PanelMicroToponym({ microToponym }: PanelMicroToponymProps) {
  return (
    <PanelMicroToponymAddressList microToponym={microToponym} />
  )
}

export default PanelMicroToponym
