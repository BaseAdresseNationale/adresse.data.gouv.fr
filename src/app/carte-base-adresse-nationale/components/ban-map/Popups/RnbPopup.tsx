'use client'

import { PopupWrapper } from './Popups.styles'

interface RnbPopupProps {
  rnbId: string
}

function RnbPopup({ rnbId }: RnbPopupProps) {
  return (
    <PopupWrapper>
      <div className="heading">
        <strong>Bâtiment RNB</strong>
      </div>
      <p style={{ fontFamily: 'monospace' }}>{rnbId}</p>
      <a
        href={`https://rnb.beta.gouv.fr/carte?q=${encodeURIComponent(rnbId)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Voir la fiche sur le RNB
      </a>
    </PopupWrapper>
  )
}

export default RnbPopup
