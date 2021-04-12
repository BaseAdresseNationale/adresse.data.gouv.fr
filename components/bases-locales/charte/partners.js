import React from 'react'
import PropTypes from 'prop-types'
import Partner from '@/components/bases-locales/charte/partner'

import allPartners from 'partners.json'

function Partners({isDetailed, searchedPartners}) {
  const partners = searchedPartners || allPartners
  return (
    <div className='partners-container'>
      {partners.map(partner => {
        return <Partner key={partner.name} partnerInfos={partner} isDetailed={isDetailed} />
      })}

      <style jsx>{`
        .partners-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(${isDetailed ? '250px' : '200px'}, 1fr));
          justify-items: center;
          margin-top: 2em;
          gap: ${isDetailed ? '6em 5em' : '3em 1em'};
        }
        `}</style>
    </div>
  )
}

Partners.propTypes = {
  isDetailed: PropTypes.bool,
  searchedPartners: PropTypes.array
}

Partners.defaultProps = {
  searchedPartners: null
}

export default Partners
