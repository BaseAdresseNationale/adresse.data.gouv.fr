import Link from 'next/link'

import {
  AddressDetailsItemValue,

  AddressHeaderWrapper,

  AddressLabelWrapper,
  AddressPostCode,

  AddressNumberAndMicroTopoLabel,
  AddressMicroTopoLabelAlt,
  AddressMicroTopoLabelFlag,

  AddressDistrictLabelPrefix,
  AddressDistrictLabel,
  AddressDetailsWrapper,
  AddressDetailsItem,
} from './AddressCard.styles'
import { isNumeroCertifiable } from '@/lib/ban'
import DownloadCertificate from './download-certificate'
import type { TypeAddressExtended } from '../../types/LegacyBan.types'

interface AddressCardProps {
  address: TypeAddressExtended
  withCertificate: boolean
}

function AddressCard({ address, withCertificate }: AddressCardProps) {
  const district = address.commune
  const microToponym = address.voie
  const dateMaj = new Date(address.dateMAJ).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <>
      <AddressHeaderWrapper>
        <AddressLabelWrapper>
          <AddressNumberAndMicroTopoLabel>
            {address.numero ? `${address.numero} ` : ''}
            {address.suffixe ? `${address.suffixe} ` : ''}<br />
            {microToponym.nomVoie},
          </AddressNumberAndMicroTopoLabel>
          {microToponym?.nomVoieAlt && Object.entries(microToponym.nomVoieAlt).map(([lang, odonyme]) => (
            <AddressMicroTopoLabelAlt key={lang}>
              <AddressMicroTopoLabelFlag src={`./img/flags/${lang}.svg`} alt={`Drapeau ${lang}`} />{' '}
              {odonyme}
            </AddressMicroTopoLabelAlt>
          ))}
          {address.nomAncienneCommune && (
            <>
              <AddressDistrictLabelPrefix>Commune historique de </AddressDistrictLabelPrefix>
              <AddressDistrictLabel $historique>{address.nomAncienneCommune},</AddressDistrictLabel>
            </>
          )}
          <AddressPostCode>CP {address.codePostal},</AddressPostCode>
          <AddressDistrictLabel>{district.nom} (COG  {district.code})</AddressDistrictLabel>
        </AddressLabelWrapper>
      </AddressHeaderWrapper>

      <AddressDetailsWrapper>
        <AddressDetailsItem className="ri-key-fill">
          <span>
            Identifiant BAN : <br />
            <AddressDetailsItemValue>{address.banId}</AddressDetailsItemValue>
          </span>
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-links-line">
          <span>
            Clé d’interopérabilité :  <br />
            <AddressDetailsItemValue>{address.cleInterop}</AddressDetailsItemValue>
          </span>
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-collage-line">
          <span>
            Parcelles cadastrales :  <br />
            <AddressDetailsItemValue>{address?.parcelles.join(', ') || 'Non renseignée(s)'}</AddressDetailsItemValue>
          </span>
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-calendar-line">
          Date de mise à jour :  <br />
          {dateMaj}
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-edit-box-line">
          Producteur :  <br />
          {address.sourcePosition}
        </AddressDetailsItem>

        <AddressDetailsItem className="ri-signpost-line">
          Libellé d’acheminement :  <br />
          {address.libelleAcheminement}
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-map-pin-range-line">
          Position :  <br />
          {address.positionType}
        </AddressDetailsItem>
        <AddressDetailsItem className="ri-focus-3-line">
          Coordonnées :  <br />
          {address.position.coordinates[0]}, {address.position.coordinates[1]}
        </AddressDetailsItem>
      </AddressDetailsWrapper>

      {/* Ajout du composant DownloadCertificate sous les coordonnées */}

      { withCertificate && (
        isNumeroCertifiable({
          banId: address.banId ?? '',
          sources: Array.isArray(address.sourcePosition) ? address.sourcePosition : [address.sourcePosition],
          certifie: address.certifie,
          parcelles: address.parcelles,
        })
          ? (
              <div className="certificate">
                <DownloadCertificate
                  id={address.id}
                  title="Télécharger le Certificat d'adressage"
                />
              </div>
            )
          : (
              <div className="certificate">
                <div />
                <span>Certificat d&apos;adressage indisponible pour cette adresse, veuillez contacter votre mairie.</span>
              </div>
            )
      )}

    </>
  )
}

export default AddressCard
