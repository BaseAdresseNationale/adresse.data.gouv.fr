import { useMemo } from 'react'

import { isNumeroCertifiable } from '@/lib/ban'
import { useFocusOnMap } from '../ban-map/BanMap.context'

import Button from '@codegouvfr/react-dsfr/Button'

import DownloadCertificate from './download-certificate'

import {
  AsideFooterWrapper,
  ActionWrapper,
  ActionList,
} from './AsideFooterAddress.styles'

import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AsideFooterAddressProps {
  banItem: TypeAddressExtended
  withCertificate: boolean
  children?: React.ReactNode
}

function AsideFooterAddress({ banItem: address, withCertificate, children }: AsideFooterAddressProps) {
  const focusOnMap = useFocusOnMap(address)

  const isCertifiable = useMemo(() => isNumeroCertifiable({
    banId: address.banId ?? '',
    sources: Array.isArray(address.sourcePosition) ? address.sourcePosition : [address.sourcePosition],
    certifie: address.certifie,
    parcelles: address.parcelles,
  }), [address])

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault()
    focusOnMap()
  }

  return (
    <AsideFooterWrapper>
      {children}
      {!withCertificate && (
        <div>
          Les certifications d’adresses sur la commune de {address.commune.nom} sont
          réalisées directement par la mairie.
          Contactez-la pour obtenir un certificat d’adressage ou toute autre information.
        </div>
      )}
      {withCertificate && !isCertifiable && (
        <div>
          Cette adresse ne remplit pas les critères minimums pour obtenir une certification.
          Veuillez contacter votre mairie pour obtenir un certificat d’adressage ou toute autre information.
        </div>
      )}
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

        { withCertificate && (
          isCertifiable
            ? (
                <ActionList className="certificate">
                  <DownloadCertificate
                    id={address.id}
                  />
                </ActionList>
              )
            : (
                <ActionList className="certificate">
                  <div />
                  <span>Certificat d&apos;adressage indisponible pour cette adresse, veuillez contacter votre mairie.</span>
                </ActionList>
              )
        )}
      </ActionWrapper>
    </AsideFooterWrapper>
  )
}

export default AsideFooterAddress