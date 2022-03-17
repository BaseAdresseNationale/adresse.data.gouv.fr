import PropTypes from 'prop-types'

import BlogCard from '@/components/blog-card'
import BlogPagination from '@/components/blog-pagination'

function Temoignages({limit, posts, pagination}) {
  const sortedTestimonies = limit ? posts.slice(0, limit) : posts

  return (
    <>
      <div className='temoignages-section'>
        {sortedTestimonies.map(testimony => (
          <BlogCard key={testimony.id} post={testimony} />
        ))}
      </div>
      {pagination && (
        <BlogPagination pagination={pagination} />
      )}
      <style jsx>{`
          .temoignages-section {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            grid-gap: 3em 5em;
            margin-top: 4em;
          }
        `}</style>
    </>
  )
}

Temoignages.defaultProps = {
  limit: null,
  pagination: null
}

Temoignages.propTypes = {
  limit: PropTypes.number,
  posts: PropTypes.array.isRequired,
  pagination: PropTypes.object
}

export default Temoignages
