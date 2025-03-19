import React, { useCallback, useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import type { TypeAddressExtended } from '../../../types/LegacyBan.types'
import { ActionMessage } from './ActionComponents.styles'
import { env } from 'next-runtime-env'
import { matomoTrackEvent } from '@/lib/matomo'
import { SignalementTypeEnum } from '@/types/api-signalement.types'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'

interface ActionSignalementAddressProps {
  address: TypeAddressExtended
  mairiePageURL: string | null
}

const ActionSignalementAddress: React.FC<ActionSignalementAddressProps> = ({ address, mairiePageURL }) => {
  const [isExtended, setIsExtended] = useState(false)
  const disabled = !address.sources.includes('bal')

  const browseToMesSignalements = useCallback((signalementType: SignalementTypeEnum) => {
    matomoTrackEvent('Mes Signalements', 'Browse to', signalementType, 1)
    window.open(`${env('NEXT_PUBLIC_MES_SIGNALEMENTS')}/#/${address.cleInterop}?sourceId=${env('NEXT_PUBLIC_MES_SIGNALEMENTS_SOURCE_ID')}&type=${signalementType}`, '_blank')
  }, [address])

  return (
    <span>
      <Button
        iconId="ri-barricade-line"
        onClick={() => setIsExtended(prevState => !prevState)}
        priority="tertiary no outline"
        style={disabled ? { color: 'var(--text-disabled-grey)' } : {}}
      >
        Signaler un problème<Badge severity="info" noIcon style={{ marginLeft: '0.4rem' }}>Beta</Badge>
      </Button>
      {
        isExtended && (
          <ActionMessage $isVisible={isExtended}>
            {disabled
              ? (
                  <>
                    Les signalements sont désactivés pour votre commune car cette dernière n&apos;a pas publié sa Base Adresse Locale.
                    Nous vous recommandons de contacter directement votre <Link className="fr-link" href={mairiePageURL || ''} target="_blank">mairie</Link>.
                  </>
                )
              : (
                  <>
                    <Button
                      priority="tertiary"
                      size="small"
                      iconId="fr-icon-arrow-right-line"
                      iconPosition="right"
                      onClick={() => browseToMesSignalements(SignalementTypeEnum.LOCATION_TO_UPDATE)}
                    >Demander une modification
                    </Button>
                    <Button
                      priority="tertiary"
                      size="small"
                      iconId="fr-icon-arrow-right-line"
                      iconPosition="right"
                      onClick={() => browseToMesSignalements(SignalementTypeEnum.LOCATION_TO_DELETE)}
                    >Demander la suppression
                    </Button>
                  </>
                )}
          </ActionMessage>
        )
      }
    </span>
  )
}

export default ActionSignalementAddress
