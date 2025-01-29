import PanelMicroToponymAddressList from './PanelMicroToponymAddressList'

import type { TypeMicroToponymExtended } from '../../types/LegacyBan.types'

import AddressDetailPosition from '../AddressDetailPosition'

import {
  PanelDetailsWrapper,
  PanelDetailsItem,
  PanelDetailsItemValue,
  PanelDetailsOrigin,
  PanelDetailsCertifications,
} from '../Panel'

const configOriginAddress = {
  bal: {
    className: 'ri-star-fill isFormal',
    message: <>Cet odonyme est issue d’une Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL)</>,
    desc: <>Les Base&nbsp;Adresse&nbsp;Locale&nbsp;(BAL) sont directement produites par les communes.</>,
  },
  default: {
    className: 'ri-government-fill',
    message: <>Cet odonyme est fournie par l’IGN</>,
    desc: (
      <>
        En l’absence de Base Adresse Locale&nbsp;(BAL) officielle sur la commune,
        l’IGN fournie des odonymes produits à partir de multiples sources.
      </>
    ),
  },
}

const certificationConfig = {
  0: {
    className: 'fr-icon-error-fill isFailed',
    message: 'Aucune adresse certifiée par la commune sur cet odonyme',
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
  },
  1: {
    className: 'ri-award-line',
    message: `Adresses en cours de certification sur cet odonyme ({{CERTIFICATED_PERCENT}}%)`,
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
  },
  2: {
    className: 'ri-award-fill isSuccessful',
    message: `Adresses certifiées sur cet odonyme à {{CERTIFICATED_PERCENT}}%`,
    desc: 'Une adresse certifiée indique que la commune a validé l’exactitude des informations de l’adresse.',
  },
}

interface PanelMicroToponymProps {
  microToponym: TypeMicroToponymExtended
}

const isSmartDevice = () => /Mobi|Android/i.test(navigator.userAgent)

function PanelMicroToponym({ microToponym }: PanelMicroToponymProps) {
  const dateMaj = microToponym.numeros.reduce((acc, numero) => {
    const date = new Date(numero.dateMAJ)
    return acc
      ? (date > acc ? date : acc)
      : date
  }, null as Date | null)?.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) || 'N/A'

  const certificatedAddresses = microToponym.numeros.reduce((acc, numero) => {
    return numero.certifie ? acc + 1 : acc
  }, 0)
  const certificatedAddressesPercent = Math.ceil(certificatedAddresses / microToponym.nbNumeros * 100)

  return (
    <>
      <PanelDetailsWrapper>
        <PanelDetailsOrigin config={configOriginAddress} origin={microToponym.sourceNomVoie} />
        <PanelDetailsCertifications certificationConfig={certificationConfig} origin={microToponym.sourceNomVoie} certificatedPercent={certificatedAddressesPercent} />

        <PanelDetailsItem className="ri-key-line">
          <span>
            Identifiant BAN : <br />
            <PanelDetailsItemValue>{microToponym.banId || 'Non renseigné'}</PanelDetailsItemValue>
          </span>
        </PanelDetailsItem>
        <PanelDetailsItem className="ri-links-line">
          <span>
            Clé d’interopérabilité : <br />
            <PanelDetailsItemValue>{microToponym.idVoie}</PanelDetailsItemValue>
          </span>
        </PanelDetailsItem>
        <PanelDetailsItem className="ri-calendar-line">
          Date de dernière mise à jour : <br />
          {dateMaj}
        </PanelDetailsItem>
        <PanelDetailsItem className="ri-map-pin-line">
          Position : <br />
          <AddressDetailPosition
            type="Centroïde"
            coords={microToponym.position.coordinates as [number, number]}
            isSmartDevice={isSmartDevice()}
          />
        </PanelDetailsItem>
      </PanelDetailsWrapper>

      <PanelMicroToponymAddressList microToponym={microToponym} />
    </>
  )
}

export default PanelMicroToponym
