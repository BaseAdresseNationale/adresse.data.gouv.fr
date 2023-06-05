import {useContext, useState} from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import colors from '@/styles/colors'
import theme from '@/styles/theme'

import Alert from '@/components/alert'
import {getNumeroComplet, isCertifiable} from '@/lib/ban'

import Certification from '../certification'
import ParcellesList from '../parcelles-list'
import PositionsTypes from '../positions-types'

import CoordinatesCopy from './coordinates-copy'

import DeviceContext from '@/contexts/device'
import RegionInfos from '../region-infos'
import LanguagesPreview from '../languages-preview'
import DownloadCertificate from './download-certificate'

const {NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED} = process.env

function Numero({
  numero,
  suffixe,
  lieuDitComplementNom,
  lieuDitComplementNomAlt,

  certifie,
  positions,
  positionType,
  sourcePosition,
  dateMAJ,
  commune,
  nomAncienneCommune,
  voie,
  libelleAcheminement,
  parcelles,
  codePostal,
  cleInterop,
  lat,
  lon,
  isMobile,
}) {
  const {isSafariBrowser} = useContext(DeviceContext)
  const [copyError, setCopyError] = useState(null)
  const [isCopyAvailable, setIsCopyAvailable] = useState(true)
  const [isCopySucceded, setIsCopySucceded] = useState(false)

  const coordinates = {lat, lon}
  const copyUnvailableMessage = `Votre navigateur est incompatible avec la copie des coordonnées GPS : ${lat},${lon}`
  const sanitizedType = positionType ?
    positionType.charAt(0).toUpperCase() + positionType.slice(1) :
    'Inconnu'

  return (
    <>
      <div className='heading'>
        <div className='voie-names'>
          <div className='name-certification'>
            <h2>
              {getNumeroComplet({numero, suffixe})}{' '}
              <Link
                href={`/base-adresse-nationale?id=${voie.id}`}
                as={`/base-adresse-nationale/${voie.id}`}
                legacyBehavior
              >
                <a>{voie.nomVoie}</a>
              </Link>
              ,
            </h2>
            <div>
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
          {voie?.nomVoieAlt && <LanguagesPreview nomAlt={voie.nomVoieAlt} />}
        </div>

        {commune && (
          <h4>
            <Link
              href={`/base-adresse-nationale?id=${commune.id}`}
              as={`/base-adresse-nationale/${commune.id}`}
              legacyBehavior
            >
              <a>
                {commune.nom} - {commune.code}
              </a>
            </Link>
          </h4>
        )}
      </div>

      <RegionInfos
        codeCommune={commune.code}
        region={commune.region}
        departement={commune.departement}
      />
      <div className='numero-details'>
        {nomAncienneCommune && (
          <div>
            Ancienne commune : <b>{nomAncienneCommune}</b>
          </div>
        )}
        {lieuDitComplementNom && (
          <div>
            <div>
              Lieu-dit : <b>{lieuDitComplementNom}</b>
            </div>
            {lieuDitComplementNomAlt && (
              <LanguagesPreview nomAlt={lieuDitComplementNomAlt} />
            )}
          </div>
        )}
        {codePostal && (
          <div>
            Code postal : <b>{codePostal}</b>
          </div>
        )}
        {libelleAcheminement && (
          <div>
            Libellé d’acheminement : <b>{libelleAcheminement}</b>
          </div>
        )}
        <div>
          Type de position : <b>{sanitizedType}</b>
        </div>
        <div>
          Clé d’interopérabilité : <b>{cleInterop}</b>
        </div>
        <div>
          Parcelles cadastrales : <ParcellesList parcelles={parcelles} />
        </div>
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

      <div className='update'>
        Adresse mise à jour le{' '}
        <b>
          {dateMAJ ? new Date(dateMAJ).toLocaleDateString('fr-FR') : 'inconnue'}
        </b>
      </div>

      {NEXT_PUBLIC_CERTIFICAT_NUMEROTATION_ENABLED &&
        isCertifiable({sources: sourcePosition, certifie, parcelles}) && (
        <div className='ressource'>
          <DownloadCertificate
            cleInterop={cleInterop}
            title='Télécharger le Certificat de numérotage'
          />
        </div>
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
        .heading,
        .ressource {
          display: flex;
          flex-direction: column;
          margin: 1.2em 0;
          border-bottom: 1px solid ${colors.lighterGrey};
        }
        .ressource {
          border-bottom: none;
        }

        .heading h2 {
          margin-bottom: 0.2em;
        }

        .name-certification {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .voie-names {
          margin-bottom: 1em;
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

        .update {
          text-align: center;
          margin-top: 1em;
          font-style: italic;
        }
      `}</style>
    </>
  )
}

Numero.propTypes = {
  numero: PropTypes.number.isRequired,
  suffixe: PropTypes.string,
  lieuDitComplementNom: PropTypes.string,
  lieuDitComplementNomAlt: PropTypes.object,
  certifie: PropTypes.bool.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  parcelles: PropTypes.array.isRequired,
  positions: PropTypes.array,
  dateMAJ: PropTypes.string,
  nomAncienneCommune: PropTypes.string,
  commune: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    region: PropTypes.object,
    departement: PropTypes.object,
  }).isRequired,
  voie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nomVoie: PropTypes.string.isRequired,
    nomVoieAlt: PropTypes.object,
  }),
  libelleAcheminement: PropTypes.string,
  codePostal: PropTypes.string,
  cleInterop: PropTypes.string.isRequired,
  positionType: PropTypes.string,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  isMobile: PropTypes.bool,
}

Numero.defaultProps = {
  suffixe: null,
  lieuDitComplementNom: null,
  positions: [],
  codePostal: null,
  libelleAcheminement: null,
  positionType: null,
  dateMAJ: null,
  isMobile: false,
}

export default Numero
