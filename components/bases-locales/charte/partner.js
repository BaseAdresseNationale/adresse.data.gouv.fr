import {useState} from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'
import {ChevronDown, ChevronUp} from 'react-feather'

import theme from '@/styles/theme'

const formatService = service => {
  if (service.includes('’')) {
    service = service.replace('’', ' ')
  }

  return `#${service.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Partner({partnerInfos}) {
  const [isDisplay, setIsDisplay] = useState(false)
  const {name, link, alt, infos, perimeter, services, picture, height, width, isCompany} = partnerInfos

  return (
    <div className='partner'>
      <div className='general-partner-infos'>
        <p className='name'>
          <b><a href={link}>{`${name} ${isCompany ? '(société)' : ''}`}</a></b>
        </p>
        <div className='logo'>
          <Image
            src={picture}
            alt={alt}
            height={height}
            width={width}
            layout='fixed'
          />
        </div>
        <div className='display-info-container'>
          <button type='button' onClick={() => setIsDisplay(!isDisplay)} className='button-container'>
            {isDisplay ? (
              <p>Masquer les informations</p>
            ) : (
              <p>Afficher les informations</p>
            )}
            <div className='chevron'>
              {isDisplay ? (
                <ChevronUp size={18} color={`${theme.colors.lightBlue}`} />
              ) : (
                <ChevronDown size={18} color={`${theme.colors.lightBlue}`} />
              )}
            </div>
          </button>
        </div>
      </div>
      <div className={isDisplay ? 'infos-container' : 'hidden'}>
        <p>{infos}</p>
        <div className='perimeter'>
          <div className='title'>Périmètre</div>
          <p>{perimeter}</p>
        </div>
        <div className='services'>
          <div className='title'>Offres de services</div>
          {services.map(service => {
            return <p key={service}>{formatService(service)}</p>
          })}
        </div>
      </div>

      <style jsx>{`
        .partner {
          max-width: 300px;
          width: 100%;
          grid-template-rows: 0.5fr auto;
          grid-template-columns: 1fr;
          display: grid;
          align-items: start;
          justify-content: center;
        }

        .general-partner-infos {
          text-align: left;
          display: grid;
          grid-template-rows: 40px 124px 20px;
          grid-template-columns: 1fr;
          gap: 1.5em;
          width: 100%;
        }

        .name {
          margin: 0;
          font-size: 1em;
          font-weight: bold;
          font-style: normal;
          align-self: flex-start;
        }

        a {
          color: ${theme.colors.darkerGrey};
        }

        .logo {
          align-self: center;
        }

        .display-info-container {
          width: 100%;
          display: grid;
          grid-template-rows: 1fr 0.5fr;
          font-style: italic;
          color: ${theme.colors.darkerGrey};
        }

        .button-container {
          display: grid;
          grid-template-columns: 1fr 0.1fr;
          align-items: center;
          justify-items: self-start;
          border-style: none;
          background-color: transparent;
          border-bottom: 2px solid ${theme.colors.lightBlue};
          box-shadow: 0px 14px 21px -11px ${theme.boxShadow};
        }

        .chevron {
          justify-self: end;
          padding-top: 0.4em;
        }

        .infos-container {
          text-align: start;
          display: grid;
          grid-template-rows: 1fr auto;
          gap: 0.5em;
          animation: fadeIn ease 1s;
          margin-top: 20px;
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

        .perimeter p, .services p {
          margin: 0;
          font-size: 0.9em;
          font-weight: bold;
          color: ${theme.colors.almostBlack};
        }

        .hidden {
          display: none;
        }

        @keyframes fadeIn {
          0% {opacity:0;}
          100% {opacity:1;}
        }
      `}</style>
    </div>
  )
}

Partner.propTypes = {
  partnerInfos: PropTypes.shape({
    name: PropTypes.string,
    link: PropTypes.string,
    infos: PropTypes.string,
    perimeter: PropTypes.string,
    services: PropTypes.array,
    picture: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    alt: PropTypes.string,
    isCompany: PropTypes.bool.isRequired
  }).isRequired
}

export default Partner
