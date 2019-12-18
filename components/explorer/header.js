import React from 'react'
import FaSearch from 'react-icons/lib/fa/search'

import Section from '../section'
import ExploreSearch from './explore-search'

const Explorer = () => (
  <Section background='color'>
    <div>
      <h2><div className='iconTitle'><FaSearch /></div> Rechercher une commune, une voie ou une adresse</h2>
    </div>

    <ExploreSearch />

    <style jsx>{`
        .iconTitle {
          display: inline-flex;
          vertical-align: top;
        }
      `}</style>
  </Section>
)

export default Explorer
