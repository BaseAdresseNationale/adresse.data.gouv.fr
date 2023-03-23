import PropTypes from 'prop-types'
import UserBAN from '@/components/donnees-nationales/user-ban'
import {shuffle} from 'lodash'
import {useState, useEffect} from 'react'

import colors from '@/styles/colors'

function UsersBAN({data}) {
  const [items, setItems] = useState([])
  useEffect(() => {
    setItems(shuffle(data))
  }, [data])

  return items.length > 0 ? (
    <>
      <div className='users-container'>
        {items.map(user => <UserBAN key={user.name} userInfos={user} />)}
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
  ) : null
}

UsersBAN.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired
  }))
}

export default UsersBAN
