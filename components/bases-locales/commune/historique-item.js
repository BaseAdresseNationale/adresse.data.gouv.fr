import theme from '@/styles/theme'
import PropTypes from 'prop-types'
import {Circle} from 'react-feather'

function HistoriqueItem({balData, communeName}) {
  const {updatedAt, habilitation, client, current} = balData
  let userName = balData.context.nomComplet || balData.context.organisation

  const date = new Date(updatedAt)
  const completUpdateTime = `le ${date.toLocaleDateString('fr-FR')} à ${date.getHours()}h${date.getMinutes()}`

  if (!userName) {
    if (habilitation.strategy.type === 'email') {
      userName = `la mairie de ${communeName}`
    } else if (habilitation.strategy.type === 'franceconnect') {
      userName = `l'élu(e) de ${communeName}`
    }
  }

  return (
    <div className='item-container'>
      <div className='update-infos'>
        <div className='status'><Circle color={current ? theme.successBorder : theme.colors.darkGrey} /></div>
        <div className='date'>{completUpdateTime}</div>
      </div>

      <div className='user-infos'>
        <div>Par <b>{userName}</b></div>
        <div>Via <b>{client?.nom ? client.nom : 'non renseigné'}</b></div>
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
          display: flex;
          align-items: center;
          font-size: large;
        }

        .user-infos div {
          flex: 1;
        }

        .date {
          background: ${theme.primary};
          color: ${theme.colors.white};
          border-radius: ${theme.borderRadius};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }

        @media (max-width: ${theme.breakPoints.laptop}) {
          .item-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
          }

          .user-infos {
            flex-direction: column;
            align-items: self-start;
            padding-left: 1em;
            gap: 10px;
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
