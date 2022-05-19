import {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import colors from '@/styles/colors'
import theme from '@/styles/theme'

import Alert from '@/components/alert'
import {getNumeroComplet} from '@/lib/ban'

import Certification from '../certification'
import ParcellesList from '../parcelles-list'
import PositionsTypes from '../positions-types'

import CoordinatesCopy from './coordinates-copy'

import DeviceContext from '@/contexts/device'

function Numero({numero, suffixe, lieuDitComplementNom, certifie, positions, positionType, sourcePosition, commune, voie, libelleAcheminement, parcelles, codePostal, cleInterop, lat, lon, isMobile, isCOM}) {
  const {isSafariBrowser} = useContext(DeviceContext)
  const [copyError, setCopyError] = useState(null)
  const [isCopyAvailable, setIsCopyAvailable] = useState(true)
  const [isCopySucceded, setIsCopySucceded] = useState(false)

  const coordinates = {lat, lon}
  const copyUnvailableMessage = `Votre navigateur est incompatible avec la copie des coordonnées GPS : ${lat},${lon}`
  const sanitizedType = positionType ? (positionType.charAt(0).toUpperCase() + positionType.slice(1)) : 'Inconnu'

  return (
    <>
      <div className='heading'>
        <div>
          <h2>{getNumeroComplet({numero, suffixe})} <Link href={`/base-adresse-nationale?id=${voie.id}`} as={`/base-adresse-nationale/${voie.id}`}><a>{voie.nomVoie}</a></Link>,</h2>
          {commune && <h4><Link href={`/base-adresse-nationale?id=${commune.id}`} as={`/base-adresse-nationale/${commune.id}`}><a>{commune.nom} - {commune.code}</a></Link></h4>}

          <div className='region'>
            {isCOM ? `Collectivité d’outremer - ${commune.departement.nom} (${commune.departement.code})` : `${commune.region.nom} - ${commune.departement.nom} (${commune.departement.code})`}
          </div>
        </div>
        <div style={{padding: '1em'}}>
          <Certification
            isCertified={certifie || sourcePosition === 'bal'}
            validIconColor={certifie ? theme.successBorder : theme.border}
            certifiedMessage={
              certifie ?
                'Cette adresse est certifiée par la commune' :
                'Cette adresse est en cours de certification par la commune'
            }
            notCertifiedMessage='Cette adresse n’est pas certifiée par la commune'
          />
        </div>
      </div>
      <div className='numero-details'>
        {lieuDitComplementNom && (
          <div>Lieu-dit : <b>{lieuDitComplementNom}</b></div>
        )}
        {codePostal && <div>Code postal : <b>{codePostal}</b></div>}
        {libelleAcheminement && <div>Libellé d’acheminement : <b>{libelleAcheminement}</b></div>}
        <div>Type de position : <b>{sanitizedType}</b></div>
        <div>Clé d’interopérabilité : <b>{cleInterop}</b></div>
        <div>Parcelles cadastrales : <ParcellesList parcelles={parcelles} /></div>
      </div>

      {positions?.length > 1 ? (
        <PositionsTypes
          positions={positions}
          isMobile={isMobile}
          isSafariBrowser={isSafariBrowser}
          setCopyError={setCopyError}
          setIsCopySucceded={setIsCopySucceded}
          setIsCopyAvailable={setIsCopyAvailable}
        />
      ) : (
        <CoordinatesCopy
          isMobile={isMobile}
          isSafariBrowser={isSafariBrowser}
          coordinates={coordinates}
          setCopyError={setCopyError}
          setIsCopySucceded={setIsCopySucceded}
          setIsCopyAvailable={setIsCopyAvailable}
        />
      )}

      {isCopySucceded && (
        <Alert
          type='success'
          message='Coordonnées GPS copiées'
          onClose={() => setIsCopySucceded(false)}
        />
      )}

      {copyError && (
        <Alert
          type='error'
          message={copyError}
          onClose={() => setCopyError(null)}
        />
      )}

      {!isCopyAvailable && (
        <Alert
          type='warning'
          duration={10000}
          message={copyUnvailableMessage}
          onClose={() => setIsCopyAvailable(true)}
        />
      )}
      <style jsx>{`
        .heading {
          display: grid;
          grid-template-columns: 3fr 1fr;
          justify-content: space-between;
          align-items: center;
          margin: 1.2em 0;
          border-bottom: 1px solid ${colors.lighterGrey};
        }

        .heading h2 {
          margin-bottom: 0.2em;
        }

        .region {
          margin: 2em 0 0.7em 0;
          font-style: italic;
          font-size: 17px;
          color: ${colors.almostBlack};
        }

        .numero-details {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: start;
        }

        .numero-details > div {
          margin: 0.5em 0 0.5em 0;
          font-size: 1.1em;
          font-style: italic;
          color: ${colors.almostBlack};
        }
      `}</style>
    </>
  )
}

Numero.propTypes = {
  numero: PropTypes.number.isRequired,
  suffixe: PropTypes.string,
  lieuDitComplementNom: PropTypes.string,
  certifie: PropTypes.bool.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  parcelles: PropTypes.array.isRequired,
  positions: PropTypes.array,
  commune: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    region: PropTypes.object,
    departement: PropTypes.object
  }).isRequired,
  voie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nomVoie: PropTypes.string.isRequired
  }),
  libelleAcheminement: PropTypes.string,
  codePostal: PropTypes.string,
  cleInterop: PropTypes.string.isRequired,
  positionType: PropTypes.string,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  isMobile: PropTypes.bool,
  isCOM: PropTypes.bool
}

Numero.defaultProps = {
  codePostal: null,
  libelleAcheminement: null
}

export default Numero
