import PropTypes from 'prop-types'
import Image from 'next/image'
import theme from '@/styles/theme'

function User({user, commune}) {
  const {nomNaissance, nomMarital, prenom, typeMandat} = user || {}

  return (
    <div className='user'>
      <div className='avatar'>
        <Image width={60} height={60} src={`/images/icons/${user ? 'elu' : 'commune'}.svg`} alt />
      </div>
      {user ? (
        <div className='user-infos'>{prenom} {nomMarital || nomNaissance}</div>
      ) : (
        <div className='commune-infos'>Mairie de {commune.nom}</div>
      )}
      <div className='mandat'><b>{typeMandat}</b></div>
      <style jsx>{`
        .user {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .avatar {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
          border-radius: 50%;
          height: 100px;
          width: 100px;
          border: solid 3px ${theme.colors.whiteBlue};
        }

        .user-infos, .commune-infos {
          font-size: 20px;
          font-weight: bolder;
        }

        .mandat {
          color: ${theme.primary};
          font-size: 18px;
        }
      `}</style>
    </div>
  )
}

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
