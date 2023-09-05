import PropTypes from 'prop-types'
import ButtonLink from '@/components/button-link'
import {sanitizedDate} from '@/lib/date'
import StatusBadge from '@/components/bases-locales/deploiement-bal/status-badge'

const MES_ADRESSE_URL = process.env.NEXT_PUBLIC_MES_ADRESSES || 'https://mes-adresses.data.gouv.fr'

function BaseLocaleCard({bal}) {
  const balUrl = MES_ADRESSE_URL + '/bal/' + bal._id

  return (
    <div>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-title'>
            <h4>{bal.commune} {bal.nom}</h4>
            <p><i>Modifié le {sanitizedDate(bal._updated)}</i></p>
          </div>
          <StatusBadge status={bal.status} sync={bal.sync} />
        </div>
        <div className='card-body'>
          <ButtonLink href={balUrl} style={{width: '100%'}} target='_blank'>Consulter</ButtonLink>
        </div>
      </div>
      <style jsx>{`
          .card {
            box-shadow: 0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47);
            border: 1px solid #E6E8F0;
            border-radius: 5px;
            margin-bottom: 12px;
            padding: 8px;
          }
          .card-header {
            justify-content: space-between;
            display: flex;
            margin-bottom: 12px;
          }
          .card-header-title h4 {
            margin: 0;
            font-size: 16px;
          }
          .card-header-title p {
            margin: 0;
            text-align: left;
            font-size: 12px;
          }
      `}</style>
    </div>
  )
}

BaseLocaleCard.propTypes = {
  bal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    commune: PropTypes.string.isRequired,
    _updated: PropTypes.string,
    status: PropTypes.oneOf([
      'replaced',
      'published',
      'ready-to-publish',
      'draft',
    ]).isRequired,
    sync: PropTypes.shape({
      isPaused: PropTypes.bool.isRequired,
      status: PropTypes.oneOf([
        'synced',
        'outdated',
        'conflict'
      ]),
    })
  }),
}

export default BaseLocaleCard
