import React from 'react'
import FaSearch from 'react-icons/lib/fa/search'

import Section from '../section'
import ExploreSearch from './explore-search'

const Explorer = () => (
  <Section background='color'>
    <div className='header-section'>
      <h2><div className='iconTitle'><FaSearch /></div> Rechercher une commune, une voie ou une adresse</h2>
    </div>

    <ExploreSearch />

    <style jsx>{`
        .header-section {
          margin-top: -3em;
        }
        .iconTitle {
          display: inline-flex;
          vertical-align: top;
        }
      `}</style>
  </Section>
)

export default Explorer
