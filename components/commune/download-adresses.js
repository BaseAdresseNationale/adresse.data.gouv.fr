import {useCallback} from 'react'

import PropTypes from 'prop-types'
import getConfig from 'next/config'

import {getAddressCSVLegacy, getLieuxDitsCSVLegacy, getAdressesCsvBal} from '@/lib/api-ban'
import {push as matomoPush} from '@socialgouv/matomo-next'

import DownloadCard from './download-card'
import SectionText from '../section-text'

const {isDevMode} = getConfig().publicRuntimeConfig
const matomoCategoryName = `${isDevMode ? 'DEVMODE - ' : ''}Download (Front)`

function DownloadAdresses({codeCommune, nomCommune}) {
  const addressLegacyUrl = getAddressCSVLegacy(codeCommune)
  const lieuxDitsLegacyUrl = getLieuxDitsCSVLegacy(codeCommune)

  const downloadBal = useCallback(version => () => {// Call to matomo
    matomoPush(['trackEvent', matomoCategoryName, `Download BAL ${version || '(unknow version)'}`, `${codeCommune} - ${nomCommune} - current`, 1])
  }, [codeCommune, nomCommune])

  const downloadCsvHistoriqueAdresses = useCallback(() => {// Call to matomo
    matomoPush(['trackEvent', matomoCategoryName, 'Download CSV historique adresses', `${codeCommune} - ${nomCommune} - current`, 1])
  }, [codeCommune, nomCommune])

  const downloadCsvHistoriqueLieuxDits = useCallback(() => {// Call to matomo
    matomoPush(['trackEvent', matomoCategoryName, 'Download CSV historique lieux-dits', `${codeCommune} - ${nomCommune} - current`, 1])
  }, [codeCommune, nomCommune])

  return (
    <div className='download-adresses-container'>
      <h4>Télécharger les adresses de la commune dans la Base Adresse Nationale</h4>

      <SectionText color='secondary'>
        Voici les adresses de la communes dans la <b>Base Adresse Nationale</b>. Ce fichier de référence présente la liste des voies avec les <b>libellés enrichis</b> (minuscules accentuées), mais aussi les libellés à la norme <b>AFNOR</b>, les codes <b>FANTOIR</b> mis à jour par la <b>DGFiP</b>, les points adresses géocodés, ainsi que leur lien avec les parcelles s’ils sont renseignés, la source des adresses et leur <b>certification</b>. Pour plus d’information sur la structure des informations, consultez la documentation des <a href='https://doc.adresse.data.gouv.fr/utiliser-la-base-adresse-nationale/les-fichiers-de-la-base-adresse-nationale'>fichiers de la Base Adresse Nationale</a>.
      </SectionText>

      <div className='cards-container'>
        <DownloadCard format='CSV BAL 1.3' url={getAdressesCsvBal(codeCommune, '1.3')} isAvailable color='secondary' onDownloadStart={downloadBal('1.3')} />
        <DownloadCard format='CSV BAL 1.4' url={getAdressesCsvBal(codeCommune, '1.4')} isAvailable color='secondary' onDownloadStart={downloadBal('1.4')} />
        <DownloadCard format='CSV historique (adresses)' url={addressLegacyUrl} isAvailable color='secondary' onDownloadStart={downloadCsvHistoriqueAdresses} />
        <DownloadCard format='CSV historique (lieux-dits)' url={lieuxDitsLegacyUrl} isAvailable color='secondary' onDownloadStart={downloadCsvHistoriqueLieuxDits} />
      </div>

      <style jsx>{`
        .download-adresses-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 3em 0;
          text-align: center;
        }

        h4 {
          margin: 2em 0 0 0;
          text-align: center;
        }

        .cards-container {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 2em;
        }
      `}</style>
    </div>
  )
}

DownloadAdresses.propTypes = {
  codeCommune: PropTypes.string.isRequired,
  nomCommune: PropTypes.string.isRequired
}

DownloadAdresses.defaultType = {
  revision: null
}

export default DownloadAdresses
