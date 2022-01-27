import PropTypes from 'prop-types'

import {getCommuneCSVBAL, getAddressCSVLegacy, getLieuxDitsCSVLegacy} from '@/lib/api-ban'

import DownloadCard from './download-card'

function DownloadAdresses({typeComposition, revision, codeCommune}) {
  const balUrl = getCommuneCSVBAL(codeCommune)
  const addressLegacyUrl = getAddressCSVLegacy(codeCommune)
  const lieuxDitsLegacyUrl = getLieuxDitsCSVLegacy(codeCommune)

  return (
    <div className='download-adresses-container'>
      <h4>Télécharger les adresses de la commune</h4>

      {typeComposition === 'assemblage' ? (
        <div className='cards-container'>
          <DownloadCard format='CSV historique (adresses)' url={addressLegacyUrl} isAvailable color='secondary' />
          <DownloadCard format='CSV historique (lieux-dits)' url={lieuxDitsLegacyUrl} isAvailable color='secondary' />
        </div>
      ) : (
        <div className='cards-container'>
          <DownloadCard format='CSV historique (adresses)' url={addressLegacyUrl} isAvailable color='secondary' />
          <DownloadCard format='CSV historique (lieux-dits)' url={lieuxDitsLegacyUrl} isAvailable color='secondary' />
          <DownloadCard format='BAL enrichie' url={balUrl} isAvailable={Boolean(revision)} color='secondary' />
        </div>
      )}

      <style jsx>{`
        .download-adresses-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 3em 0;
          text-align: center;
        }

        .h4 {
          margin-top: 2em;
          text-align: center;
        }

        .cards-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 2em;
        }
      `}</style>
    </div>
  )
}

DownloadAdresses.propTypes = {
  typeComposition: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  revision: PropTypes.object
}

DownloadAdresses.defaultType = {
  revision: null
}

export default DownloadAdresses
