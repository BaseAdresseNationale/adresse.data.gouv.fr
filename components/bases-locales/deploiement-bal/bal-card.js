import PropTypes from 'prop-types'
import getConfig from 'next/config'

import ButtonLink from '@/components/button-link'
import {sanitizedDate} from '@/lib/date'
import StatusBadge from '@/components/bases-locales/deploiement-bal/status-badge'

const {NEXT_PUBLIC_MES_ADRESSES: MES_ADRESSE_URL} = getConfig().publicRuntimeConfig

function BaseLocaleCard({bal}) {
  if (!MES_ADRESSE_URL) {
    console.error('`MES_ADRESSE_URL` config value is not defined')
    return null
  }

  const balUrl = `${MES_ADRESSE_URL}/bal/${bal.id}`

  return (
    <div>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-title'>
            <h4>{bal.commune} {bal.nom}</h4>
            <p><i>Modifié le {sanitizedDate(bal.updatedAt)}</i></p>
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
    id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    commune: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    status: PropTypes.oneOf([
      'replaced',
      'published',
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
