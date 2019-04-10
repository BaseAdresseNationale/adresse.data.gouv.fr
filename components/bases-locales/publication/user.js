import React from 'react'
import PropTypes from 'prop-types'

const User = React.memo(({user}) => {
  const {nomNaissance, prenom, typeMandat} = user

  return (
    <div className='user'>
      <img src='/static/images/icons/elu.svg' />
      <div>{prenom} {nomNaissance}</div>
      <div><b>{typeMandat}</b></div>
      <style jsx>{`
        .user {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        `}</style>
    </div>
  )
})

User.propTypes = {
  user: PropTypes.shape({
    nomNaissance: PropTypes.string.isRequired,
    prenom: PropTypes.string.isRequired,
    typeMandat: PropTypes.string.isRequired
  }).isRequired
}

export default User
