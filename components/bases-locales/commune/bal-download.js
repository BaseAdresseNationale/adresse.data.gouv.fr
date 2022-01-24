import PropTypes from 'prop-types'
import {Edit2} from 'react-feather'

import {getCurrentBal} from '@/lib/api-ban'

import Section from '@/components/section'
import DownloadCard from '@/components/bases-locales/commune/download-card'
import ButtonLink from '@/components/button-link'

function BALDownload({communeName, codeCommune, isFileAvailable}) {
  const csvUrl = getCurrentBal(codeCommune)

  return (
    <Section background='grey' title={`Télécharger le fichier CSV de la Base Adresse Locale de ${communeName}`}>
      {isFileAvailable ? (
        <div className='download-bal-container'>
          <DownloadCard format='CSV' url={csvUrl} isAvailable color='primary' />
        </div>
      ) : (
        <div className='download-bal-container'>
          <p>Aucun fichier n’est actuellement disponible pour cette commune</p>

          <ButtonLink
            isExternal
            size='large'
            target='_blank'
            rel='noreferrer'
            href='https://mes-adresses.data.gouv.fr/new'
          >
            Créer votre Base Adresse Locale <Edit2 style={{verticalAlign: 'bottom', marginLeft: '3px'}} />
          </ButtonLink>
        </div>
      )}

      <style jsx>{`
        .download-bal-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3em;
          margin-top: 3em;
        }

        p {
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </Section>
  )
}

BALDownload.propTypes = {
  communeName: PropTypes.string.isRequired,
  codeCommune: PropTypes.string.isRequired,
  isFileAvailable: PropTypes.bool.isRequired
}

export default BALDownload
