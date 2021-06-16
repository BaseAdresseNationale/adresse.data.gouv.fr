import React, {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import colors from '@/styles/colors'

import Notification from '@/components/notification'
import {getNumeroComplet} from '@/lib/ban'

import Certification from '../certification'
import ParcellesList from '../parcelles-list'

import CoordinatesCopy from './coordinates-copy'

import {DeviceContext} from 'pages/_app'

function Numero({numero, suffixe, lieuDitComplementNom, sourcePosition, commune, voie, libelleAcheminement, parcelles, codePostal, cleInterop, lat, lon, isMobile}) {
  const {isSafariBrowser} = useContext(DeviceContext)
  const [copyError, setCopyError] = useState(null)
  const [isCopyAvailable, setIsCopyAvailable] = useState(true)
  const [isCopySucceded, setIsCopySucceded] = useState(false)
  const coordinates = {lat, lon}

  return (
    <>
      <div className='heading'>
        <div>
          <h2>{getNumeroComplet({numero, suffixe})} <Link href={`/base-adresse-nationale?id=${voie.id}`} as={`/base-adresse-nationale/${voie.id}`}><a>{voie.nomVoie}</a></Link>,</h2>
          {commune && <h4><Link href={`/base-adresse-nationale?id=${commune.id}`} as={`/base-adresse-nationale/${commune.id}`}><a>{commune.nom} - {commune.code}</a></Link></h4>}
          <div className='region'>{commune.region.nom} - {commune.departement.nom} ({commune.departement.code})</div>
        </div>
        <div style={{padding: '1em'}}>
          <Certification
            isCertified={sourcePosition === 'bal'}
            certifiedMessage='Ce numéro est certifié par la commune'
            notCertifiedMessage='Ce numéro n’est pas certifié par la commune'
          />
        </div>
      </div>
      <div className='numero-details'>
        {lieuDitComplementNom && (
          <div>Lieu-dit : <b>{lieuDitComplementNom}</b></div>
        )}
        <div>Code postal : <b>{codePostal}</b></div>
        <div>Libellé d’acheminement : <b>{libelleAcheminement}</b></div>
        <div>Clé d’interopérabilité : <b>{cleInterop}</b></div>
        <div>Parcelles cadastrales : <ParcellesList parcelles={parcelles} /></div>
      </div>

      <CoordinatesCopy
        isMobile={isMobile}
        isSafariBrowser={isSafariBrowser}
        coordinates={coordinates}
        setCopyError={setCopyError}
        setIsCopySucceded={setIsCopySucceded}
        setIsCopyAvailable={setIsCopyAvailable}
      />

      <div id='copy-alert' className='copy-alert'>
        {isCopySucceded && (
          <Notification type='success' message='Coordonnées GPS copiées' onClose={() => setIsCopySucceded(false)} />
        )}

        {copyError && (
          <Notification type='error' message={copyError} onClose={() => setCopyError(null)} />
        )}

        {!isCopyAvailable && (
          <Notification type='warning' onClose={() => setIsCopyAvailable(true)}>
            <p>
              Votre navigateur est incompatible avec la copie des coordonnées GPS.<br />{}
              Vous les trouverez ci-dessous :
            </p>
            <p>
              <b>{lat},{lon}</b>
            </p>
          </Notification>
        )}
      </div>
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

        .copy-alert {
          margin-top: 1em;
        }
      `}</style>
    </>
  )
}

Numero.defaultProps = {
  isMobile: false
}

Numero.propTypes = {
  numero: PropTypes.string.isRequired,
  suffixe: PropTypes.string,
  lieuDitComplementNom: PropTypes.string,
  sourcePosition: PropTypes.string.isRequired,
  parcelles: PropTypes.array.isRequired,
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
  libelleAcheminement: PropTypes.string.isRequired,
  codePostal: PropTypes.string.isRequired,
  cleInterop: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  isMobile: PropTypes.bool
}

export default Numero
