import theme from '@/styles/theme'
import PropTypes from 'prop-types'
import {Circle, Download} from 'react-feather'

import {getBalUrl} from '@/lib/api-depot'
import {sanitizedDateTime, accessibleDateTime} from '@/lib/date'

function HistoriqueItem({balData, communeName}) {
  const {updatedAt, client, current, _id} = balData

  const balURL = getBalUrl(_id)
  const userName = balData.context?.organisation || `la mairie de ${communeName}`

  return (
    <div className='item-container'>
      <div className='update-infos'>
        <div className='status'><Circle color={current ? theme.successBorder : theme.colors.darkGrey} /></div>
        <div className='date'>{sanitizedDateTime(updatedAt)}</div>
      </div>

      <div className='user-infos'>
        <div>Par <b>{userName}</b></div>
        <div>Via <b>{client.nom}</b></div>
        <a href={balURL} aria-label={`Télécharger la version du ${accessibleDateTime(updatedAt)}`}><Download /></a>
      </div>

      <style jsx>{`
        .item-container {
          display: grid;
          grid-template-columns: .5fr 1fr;
          gap: 1em;
          padding: 1em;
          background: ${theme.colors.lighterGrey};
          border-radius: ${theme.borderRadius};
        }

        .update-infos {
          display: grid;
          grid-template-columns: 50px 1fr;
          align-items: center;
          gap: 2em;
        }

        .user-infos {
          display: grid;
          grid-template-columns: 1fr 1fr .4fr;
          align-items: center;
          font-size: large;
        }

        .date {
          background: ${theme.primary};
          color: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          font-size: 18px;
        }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .item-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
          }

          .user-infos {
            display: flex;
            flex-direction: column;
            padding-left: 1em;
            gap: 10px;
            align-items: center;
          }
        }
    `}</style>
    </div>
  )
}

HistoriqueItem.propTypes = {
  balData: PropTypes.object.isRequired,
  communeName: PropTypes.string.isRequired
}

export default HistoriqueItem
