import React from 'react'
import testimonies from 'public/temoignages.json'
import PropTypes from 'prop-types'

import Temoignage from '@/components/temoignage'

function Temoignages({limit}) {
  const sortByDate = (a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    if (dateA === dateB) {
      return 0
    }

    return dateA < dateB ? 1 : -1
  }

  const sortedTestimonies = limit ? testimonies.sort(sortByDate).slice(0, limit) : testimonies.sort(sortByDate)

  return (
    <div className='temoignages-section'>
      {sortedTestimonies.map(temoignage => (
        <Temoignage key={temoignage.title} temoignage={temoignage} />
      ))}

      <style jsx>{`
          .temoignages-section {
            margin-top: 4em;
            text-align: center;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 6em;
          }
        `}</style>
    </div>
  )
}

Temoignages.propTypes = {
  limit: PropTypes.number
}

Temoignages.defaultProps = {
  limit: null
}
export default Temoignages
