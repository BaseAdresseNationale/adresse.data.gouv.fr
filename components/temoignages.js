import testimonies from 'temoignages.json'
import PropTypes from 'prop-types'

import Temoignage from '@/components/temoignage'

function Temoignages({limit}) {
  const sortByDate = (a, b) => {
    if (a.date === b.date) {
      return 0
    }

    return a.date < b.date ? 1 : -1
  }

  const sortedTestimonies = limit ? testimonies.sort(sortByDate).slice(0, limit) : testimonies.sort(sortByDate)

  return (
    <div className='temoignages-section'>
      {sortedTestimonies.map(testimony => (
        <Temoignage key={testimony.title} testimony={testimony} />
      ))}

      <style jsx>{`
          .temoignages-section {
            text-align: center;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            grid-column-gap: 6em;
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
