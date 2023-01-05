import PropTypes from 'prop-types'
import UserBAN from '@/components/donnees-nationales/user-ban'
import {orderBy} from 'lodash'

import colors from '@/styles/colors'

function UsersBAN({data}) {
  const items = orderBy(data, 'name', 'asc')

  return (
    <>
      <div className='users-container'>
        {items.map(user => <UserBAN key={user.name} UserInfos={user} />)}
      </div>

      <style jsx>{`
        .users-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          justify-items: center;
          margin-top: 4em;
          gap: 8em;
        }

        .subtitle {
          margin-top: 2em;
          color: ${colors.black};
          font-weight: bold;
          align-self: center;
        }
      `}</style>
    </>
  )
}

UsersBAN.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  }))
}

export default UsersBAN
