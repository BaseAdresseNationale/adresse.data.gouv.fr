import { useCallback, useEffect, useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

import { useFocusOnMap } from '../ban-map/BanMap.context'
import {
  AsideFooterWrapper,
  ActionWrapper,
  ActionList,
} from './PanelMicroToponymFooter.styles'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'
import ActionSignalementMicroToponym from './ActionComponents/ActionSignalementMicroToponym'
import { getMairiePageURL } from '@/lib/api-etablissement-public'

interface PanelMicroToponymFooterProps {
  banItem: TypeMicroToponymExtended
  withCertificate: boolean
  children?: React.ReactNode
  onClickAction?: () => void
}

function PanelMicroToponymFooter({ banItem: microToponym, children, onClickAction }: PanelMicroToponymFooterProps) {
  const [mairiePageURL, setMairiePageURL] = useState<string | null>(null)

  const focusOnMap = useFocusOnMap(microToponym)

  const handleClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    focusOnMap()
    if (onClickAction) onClickAction()
  }, [focusOnMap, onClickAction])

  useEffect(() => {
    if (!microToponym) return
    (async () => {
      const url = await getMairiePageURL(microToponym.commune.code)
      setMairiePageURL(url)
    })()
  }, [microToponym])

  return (
    <AsideFooterWrapper>
      {children}
      <ActionWrapper>
        <ActionList>
          <Button
            iconId="ri-focus-3-line"
            onClick={handleClick}
            priority="tertiary no outline"
          >
            Centrer la carte sur l’odonyme
          </Button>

        </ActionList>
        <ActionList>
          <ActionSignalementMicroToponym address={microToponym} mairiePageURL={mairiePageURL} />
        </ActionList>
      </ActionWrapper>
    </AsideFooterWrapper>
  )
}

export default PanelMicroToponymFooter
