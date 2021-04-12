
import React, {useState} from 'react'
import Image from 'next/image'
import PropTypes from 'prop-types'

import colors from '@/styles/colors'
import {ChevronDown, ChevronUp} from 'react-feather'

const formatService = service => {
  return `#${service.split(' ').map(word =>
    word[0].toUpperCase() + word.slice(1, word.length)
  ).join('')}`
}

function Partner({partnerInfos, isDetailed, isSearched}) {
  const [isDisplay, setIsDisplay] = useState(false)
  const {name, link, alt, infos, perimeter, services, picture, height, width} = partnerInfos

  return (
    <div className='partner'>
      <div className={isDetailed && 'general-partner-infos'}>
        {isDetailed && <p className='name'>
          <b><a href={link}>{name}</a></b>
        </p>}
        <div className='logo'>
          <Image
            src={picture}
            alt={alt}
            height={isDetailed ? height : height / 1.2}
            width={isDetailed ? width : width / 1.2}
            layout='fixed'
          />
        </div>
        {isDetailed && <div className='display-info-container'>
          <button type='button' onClick={() => setIsDisplay(!isDisplay)} className='button-container'>
            {isDisplay ? (
              <p>Masquer les informations</p>
            ) : (
              <p>Afficher les informations</p>
            )}
            <div className='chevron'>
              {isDisplay ? (
                <ChevronUp size={18} color={`${colors.lightBlue}`} />
              ) : (
                <ChevronDown size={18} color={`${colors.lightBlue}`} />
              )}
            </div>
          </button>
          <div className='separator' />
        </div>}
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
            width: 100%;
            grid-template-rows: ${isDetailed && '0.5fr auto'};
            grid-template-columns: ${isSearched ? '300px' : '1fr'};
            display: grid;
            flex-direction: column;
            align-items: ${isDetailed ? 'start' : 'center'};
            ${!isDetailed && 'justify-content: center;'}
          }

          .general-partner-infos {
            text-align: left;
            display: grid;
            grid-template-rows: 1fr 150px 20px;
            grid-template-columns: 1fr;
            align-items: center;
            width: 100%;
          }

          .name {
            margin: 0;
            font-size: 1em;
            font-weight: bold;
            font-style: normal;
          }

          a {
            color: ${colors.darkGrey};
          }

          .display-info-container {
            width: 100%;
            display: grid;
            grid-template-rows: 1fr 0.5fr;
            font-style: italic;
            color: ${colors.darkerGrey};
          }

          .button-container {
            margin-top: 4em;
            display: grid;
            grid-template-columns: 1fr 0.1fr;
            align-items: center;
            justify-items: self-start;
            border-style: none;
            background-color: transparent;
            border-bottom: 1px solid ${colors.lightBlue};
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
            margin-top: 1em;
            animation: fadeIn ease 1s;
          }

          p {
            font-style: italic;
            color:${colors.darkGrey};
          }

          .title {
            font-size: 1em;
            font-weight: normal;
            margin: 0;
            font-style: italic;
            color: ${colors.almostBlack};
          }

          .perimeter p, .services p {
            margin: 0;
            font-size: 0.9em;
            font-weight: bold;
            color: ${colors.almostBlack};
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
    alt: PropTypes.string
  }).isRequired,
  isDetailed: PropTypes.bool.isRequired,
  isSearched: PropTypes.bool.isRequired
}

export default Partner
