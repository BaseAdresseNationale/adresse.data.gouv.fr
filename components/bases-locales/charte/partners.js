import React from 'react'
import partners from 'partners.json'
import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'

function Partners({isDetailed}) {
  return (
    <div className='partners-container'>
      {partners.map(partner => {
        return <Partner key={partner.name} partnerInfos={partner} isDetailed={isDetailed} />
      })}

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${isDetailed ? '250px' : '200px'}, 1fr));
          align-items: ${isDetailed ? 'start' : 'center'}
          justify-items: center;
          margin-top: 2em;
          gap: ${isDetailed ? '6em 5em' : '3em 0'};
        }
        `}</style>
    </div>
  )
}

Partners.propTypes = {
  isDetailed: PropTypes.bool
}

export default Partners
