import React from 'react'
import PropTypes from 'prop-types'
import Image from 'next/image'

const User = React.memo(({user, commune}) => {
  const {nomNaissance, nomMarital, prenom, typeMandat} = user || {}

  return (
    <div className='user'>
      <Image width={88} height={88} src={`/images/icons/${user ? 'elu' : 'commune'}.svg`} alt='elu' />
      {user ? (
        <div>{prenom} {nomMarital || nomNaissance}</div>
      ) : (
        <div>Mairie de {commune.nom}</div>
      )}
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
    nomMarital: PropTypes.string,
    prenom: PropTypes.string.isRequired,
    typeMandat: PropTypes.string.isRequired
  }).isRequired,
  commune: PropTypes.shape({
    nom: PropTypes.string.isRequired
  }).isRequired
}

export default User
