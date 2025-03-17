import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Button from '@codegouvfr/react-dsfr/Button'

import { isAddressCertifiable } from '@/lib/ban'
import { getMairiePageURL } from '@/lib/api-etablissement-public'

import {
  ActionWrapper,
  ActionList,
  ActionDownloadCertificate,
} from './ActionComponents'
import { useFocusOnMap } from '../ban-map/BanMap.context'
import { AsideFooterWrapper } from './PanelAddressFooter.styles'

import type { MapItem } from '../ban-map/BanMap.context'
import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AsideFooterAddressProps {
  banItem: TypeAddressExtended
  withCertificate: boolean
  children?: React.ReactNode
  onClickAction?: (actionName?: string) => void
}

function AsideFooterAddress({ banItem: address, withCertificate, children, onClickAction }: AsideFooterAddressProps) {
  const [mairiePageURL, setMairiePageURL] = useState<string | null>(null)
  const focusOnMap = useFocusOnMap(address as MapItem)

  const isCertifiable = useMemo(() => isAddressCertifiable({
    banId: address.banId ?? '',
    sources: Array.isArray(address.sourcePosition) ? address.sourcePosition : [address.sourcePosition],
    certifie: address.certifie,
    parcelles: address.parcelles,
    withBanId: address.withBanId,
  }), [address])

  const handleClickCenterAddr = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    focusOnMap()
    if (onClickAction) onClickAction('panel-address--action--center-address')
  }, [focusOnMap, onClickAction])

  const handleClickAddressReport = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    console.log('Proposer une modification de cette adresse >>>', address)
    if (onClickAction) onClickAction('panel-address--action--address-report')
  }, [address, onClickAction])

  const codeCommune = address.commune?.code
  useEffect(() => {
    if (!address) return
    if (!codeCommune) return
    (async () => {
      const url = await getMairiePageURL(codeCommune)
      setMairiePageURL(url)
    })()
  }, [address, codeCommune])

  return (
    <AsideFooterWrapper>
      {children}
      <ActionWrapper>
        <ActionList>
          <Button
            iconId="ri-focus-3-line"
            onClick={handleClickCenterAddr}
            priority="tertiary no outline"
          >
            Centrer la carte sur l’adresse
          </Button>

        </ActionList>

        <ActionList>
          <Button
            iconId="ri-file-edit-line"
            onClick={handleClickAddressReport}
            priority="tertiary no outline"
          >
            Proposer une modification de cette adresse
          </Button>
        </ActionList>

        <ActionList className="certificate">
          {
            (
              !withCertificate && (
                <ActionDownloadCertificate
                  id={address.id}
                  message={(
                    <>
                      Les certifications d’adresses sur la commune de {address.commune.nom} sont
                      réalisées directement par la mairie.<br />
                      <Link className="fr-link" href={mairiePageURL || ''} target="_blank">Contactez-la</Link> pour obtenir un certificat d’adressage ou toute autre information.
                    </>
                  )}
                  disabled
                />
              )
            ) || (
              !isCertifiable && (
                <ActionDownloadCertificate
                  id={address.id}
                  message={(
                    <>
                      Cette adresse ne remplit pas les critères minimums
                      pour obtenir une certification.
                      Veuillez contacter votre mairie pour obtenir un certificat d’adressage
                      ou toute autre information.
                    </>
                  )}
                  disabled
                />
              )
            ) || (
              <ActionDownloadCertificate
                id={address.id}
              />
            )
          }
        </ActionList>

      </ActionWrapper>
    </AsideFooterWrapper>
  )
}

export default AsideFooterAddress
