import Image from 'next/image'
import PropTypes from 'prop-types'

import theme from '@/styles/theme'

function UserBAN({userInfos}) {
  const {name, link, usage, picture, height, width} = userInfos

  return (
    <div className='user'>
      <div className='general-user-infos'>
        <p className='name'>
          <b><a href={link}>{`${name}`}</a></b>
        </p>
        <div className='logo'>
          <Image
            src={picture}
            height={height}
            width={width}
            alt={`Logo - ${name}`}
          />
        </div>
        <div className='usage-container'>
          <p>{usage}</p>
        </div>
      </div>

      <style jsx>{`
        .user {
          max-width: 300px;
          width: 100%;
          height: fit-content;
          grid-template-rows: 0.5fr auto;
          grid-template-columns: 1fr;
          display: grid;
          align-items: start;
          justify-content: center;
          padding: 1em;
          border-radius: 5px;
        }

        .general-user-infos {
          text-align: left;
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5em;
          width: 100%;
          height: 300px;
          align-content: space-between;
        }

        .name {
          margin: 0;
          font-size: 1em;
          font-weight: bold;
          font-style: normal;
          align-self: flex-start;
          display: grid;
          grid-template-columns: 1fr 35px;
          align-items: center;
        }

        a {
          color: ${theme.colors.darkerGrey};
        }

        .logo {
          display: flex;
          justify-self: center;
        }

        .usage-container {
          width: 100%;
          font-style: italic;
          color: ${theme.colors.darkerGrey};
        }

        p {
          font-style: italic;
          color:${theme.colors.darkerGrey};
        }

        .title {
          font-size: 1em;
          font-weight: normal;
          margin: 0;
          font-style: italic;
          color: ${theme.colors.almostBlack};
        }
      `}</style>
    </div>
  )
}

UserBAN.propTypes = {
  userInfos: PropTypes.shape({
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    usage: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired
}

export default UserBAN
