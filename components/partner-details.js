import React from 'react'
import PropTypes from 'prop-types'

function PartnersDetails({infos, services, perimeter, isDisplay}) {
  return (
    <div className={isDisplay ? 'infos-container' : 'hidden'}>
      <p>{infos}</p>
      <div className='perimeter'>
        <h4>Périmètre</h4>
        <p>{perimeter}</p>
      </div>
      <div className='services'>
        <h4>Offres de services</h4>
        <p>{services}</p>
      </div>
      <style jsx>{`
          .infos-container {
            text-align: start;
            display: grid;
            grid-template-rows: 1fr auto;
            gap: 0.5em;
            margin-top: 1em;
            animation: fadeIn ease 1s;
          }

          .infos-container p {
            font-style: italic;
            color:rgb(0,0,0,0.6)
          }

          .perimeter h4, .services h4 {
            font-size: 1em;
            font-weight: normal;
            margin: 0;
            font-style: italic;
            color: rgba(0, 0, 0, 0.82);
          }

          .perimeter p, .services p {
            margin: 0;
            font-size: 0.9em;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.8);
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

PartnersDetails.propTypes = {
  infos: PropTypes.string.isRequired,
  perimeter: PropTypes.string.isRequired,
  services: PropTypes.string.isRequired,
  isDisplay: PropTypes.bool.isRequired
}

export default PartnersDetails
