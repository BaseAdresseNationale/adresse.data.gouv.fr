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
import { isMobileView, getMapAnimationOption } from '../Panel'
import { AsideFooterWrapper } from './PanelAddressFooter.styles'

import type { MapItem } from '../ban-map/BanMap.context'
import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AsideFooterAddressProps {
  banItem: TypeAddressExtended
  withCertificate: boolean
  children?: React.ReactNode
  onClickAction?: () => void
  isMenuVisible?: boolean
}

function AsideFooterAddress({ banItem: address, withCertificate, children, onClickAction, isMenuVisible = false }: AsideFooterAddressProps) {
  const [mairiePageURL, setMairiePageURL] = useState<string | null>(null)
  const focusOnMap = useFocusOnMap(address as MapItem)

  const isCertifiable = useMemo(() => isAddressCertifiable({
    banId: address.banId ?? '',
    sources: Array.isArray(address.sourcePosition) ? address.sourcePosition : [address.sourcePosition],
    certifie: address.certifie,
    parcelles: address.parcelles,
    withBanId: address.withBanId,
  }), [address])

  const handleClick = useCallback((evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    const options = getMapAnimationOption({ isMobileView: isMobileView(), isMenuVisible })
    focusOnMap(options)
    if (onClickAction) onClickAction()
  }, [focusOnMap, isMenuVisible, onClickAction])

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
            onClick={handleClick}
            priority="tertiary no outline"
          >
            Centrer la carte sur l’adresse
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
