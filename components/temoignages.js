import React from 'react'
import testimoniesData from 'public/temoignages.json'
import PropTypes from 'prop-types'

import Temoignage from '@/components/temoignage'

function Temoignages({limit}) {
  const temoignages = testimoniesData

  const sortByDate = (a, b) => {
    if (Date.parse(a.date) > Date.parse(b.date)) {
      return -1
    }

    if (Date.parse(a.date) < Date.parse(b.date)) {
      return 1
    }

    return 0
  }

  const sortedTestimonies = array => {
    return array.sort(sortByDate)
  }

  const renderedTestimonies = () => {
    return (
      sortedTestimonies(temoignages).slice(0, limit).map(temoignage => {
        return (
          <Temoignage key={temoignage.title} temoignage={temoignage} />
        )
      })
    )
  }

  return (
    <div className='temoignages-section'>
      {renderedTestimonies()}

      <style jsx>{`
          .temoignages-section {
            margin-top: 4em;
            text-align: center;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 6em
          }
        `}</style>
    </div>
  )
}

Temoignages.propTypes = {
  limit: PropTypes.number
}

Temoignages.defaultProps = {
  limit: undefined
}
export default Temoignages
