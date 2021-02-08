import React from 'react'
import testimoniesData from 'public/temoignages.json'
import PropTypes from 'prop-types'

import Temoignage from '@/components/temoignage'

function Temoignages({isLimited}) {
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
    const size = 3
    if (isLimited) {
      return (
        sortedTestimonies(temoignages).slice(0, size).map(temoignage => {
          return (
            <Temoignage key={temoignage.title} temoignage={temoignage} />
          )
        })
      )
    }

    return (
      sortedTestimonies(temoignages).map(temoignage => {
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
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 4em
          }
        `}</style>
    </div>
  )
}

Temoignages.propTypes = {
  isLimited: PropTypes.bool
}

Temoignages.defaultProps = {
  isLimited: false
}

export default Temoignages
