import PropTypes from 'prop-types'

import BlogCard from '@/components/blog-card'

function Temoignages({limit, posts}) {
  const sortedTestimonies = limit ? posts.slice(0, limit) : posts

  return (
    <div className='temoignages-section'>
      {sortedTestimonies.map(testimony => (
        <BlogCard key={testimony.id} post={testimony} />
      ))}

      <style jsx>{`
          .temoignages-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            grid-gap: 3em 5em;
            margin-top: 4em;
          }
        `}</style>
    </div>
  )
}

Temoignages.propTypes = {
  limit: PropTypes.number,
  posts: PropTypes.array.isRequired
}

Temoignages.defaultProps = {
  limit: null
}

export default Temoignages
