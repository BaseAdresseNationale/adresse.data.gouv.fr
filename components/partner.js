
import React, {useState} from 'react'
import PartnerDetails from '@/components/partner-details'
import Image from 'next/image'
import PropTypes from 'prop-types'

import {ChevronDown, ChevronUp} from 'react-feather'

function Partner({partnerInfos, isChartePage}) {
  const [isDisplay, setIsDisplay] = useState(false)
  const {name, link, alt, infos, perimeter, services, picture, height, width, heightPreview, widthPreview} = partnerInfos

  const displayChevron = () => {
    if (isDisplay) {
      return <ChevronUp size={18} color='rgba(10, 58, 231, 0.7)' />
    }

    return <ChevronDown size={18} color='rgba(10, 58, 231, 0.7)' />
  }

  const displayImage = isChartePage ? <Image src={picture} alt={alt} height={height} width={width} layout='fixed' /> : <Image src={picture} alt={alt} height={heightPreview} width={widthPreview} layout='fixed' />

  return (
    <div className={isChartePage ? 'partner' : 'frontpage-partner'} >
      <div className={isChartePage ? 'general-partner-infos' : ''}>
        {isChartePage && <p className='name'><b><a href={link} target='_blank' rel='noreferrer'>{name}</a></b></p>}
        <div className='logo'>
          {displayImage}
        </div>
        {isChartePage && <div className='display-info-container'>
          <div className='button-container'>{isDisplay ? <p>Masquer les informations</p> : <p>Afficher les informations</p>}
            <button type='button' onClick={() => setIsDisplay(!isDisplay)}>{displayChevron()}</button></div>
          <div className='separator' />
        </div>}
      </div>
      <PartnerDetails infos={infos} perimeter={perimeter} services={services} isDisplay={isDisplay} />

      <style jsx>{`
          .partner {
            width: 100%;
            grid-template-rows: 0.5fr auto;
            display: grid;
            flex-direction: column;
            align-items: start;
          }

          .frontpage-partner {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .general-partner-infos {
            text-align: left;
            display: grid;
            justify-content: start;
            align-items: center;
            grid-template-rows: 1fr 150px 20px;
            grid-template-columns: 1fr;
            width: 100%;
            justify-items: start;
          }

          .name {
            margin: 0;
            font-size: 1.2em;
            font-weight: bold;
          }

          .name a, .frontpage-name a {
            color: rgb(0,0,0,0.7)
          }

          .logo {
            display: flex;
            justify-content: start;
            align-items: center;
          }

          .display-info-container {
            display: flex;
            flex-direction: column;
            align-items: start;
            width: 100%;
          }

          .button-container {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .display-info-container p {
            font-style: italic;
            margin: 0 0.5em 0 0;
            color: rgba(0, 0, 0, 0.66);
          }

          .separator {
            margin: 0.6em 0 0 0;
            width: 100%;
            height: 0;
            border: 1px solid rgba(10, 58, 231, 0.17);
          }

          .display-info-container button {
            padding-top: 7px;
            border-style: none;
            background-color: transparent;
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
    services: PropTypes.string,
    picture: PropTypes.string,
    height: PropTypes.number,
    width: PropTypes.number,
    heightPreview: PropTypes.number,
    widthPreview: PropTypes.number,
    alt: PropTypes.string
  }).isRequired,
  isChartePage: PropTypes.bool
}

export default Partner
