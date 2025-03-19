import React, { useCallback, useMemo, useState } from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import type { TypeMicroToponymExtended } from '../../../types/LegacyBan.types'
import { ActionMessage } from '../../PanelAddress/ActionComponents/ActionComponents.styles'
import { env } from 'next-runtime-env'
import { matomoTrackEvent } from '@/lib/matomo'
import { SignalementTypeEnum } from '@/types/api-signalement.types'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Link from 'next/link'

interface ActionSignalementMicroToponymProps {
  address: TypeMicroToponymExtended
  mairiePageURL: string | null
}

const ActionSignalementMicroToponym: React.FC<ActionSignalementMicroToponymProps> = ({ address, mairiePageURL }) => {
  const [isExtended, setIsExtended] = useState(false)

  const disabled = useMemo(() => {
    if (address.type === 'voie') {
      return !address.sources.includes('bal')
    }
    if (address.type === 'lieu-dit') {
      return address.source !== 'bal'
    }

    return true
  }, [address])

  const browseToMesSignalements = useCallback((signalementType: SignalementTypeEnum) => {
    matomoTrackEvent('Mes Signalements', 'Browse to', signalementType, 1)
    window.open(`${env('NEXT_PUBLIC_MES_SIGNALEMENTS')}/#/${address.idVoie}?sourceId=${env('NEXT_PUBLIC_MES_SIGNALEMENTS_SOURCE_ID')}&type=${signalementType}`, '_blank')
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
                    {address.type === 'voie' && (
                      <Button
                        priority="tertiary"
                        size="small"
                        iconId="fr-icon-arrow-right-line"
                        iconPosition="right"
                        onClick={() => browseToMesSignalements(SignalementTypeEnum.LOCATION_TO_CREATE)}
                      >Numéro manquant
                      </Button>
                    )}
                    <Button
                      priority="tertiary"
                      size="small"
                      iconId="fr-icon-arrow-right-line"
                      iconPosition="right"
                      onClick={() => browseToMesSignalements(SignalementTypeEnum.LOCATION_TO_UPDATE)}
                    >Demander une modification
                    </Button>
                  </>
                )}
          </ActionMessage>
        )
      }
    </span>
  )
}

export default ActionSignalementMicroToponym
