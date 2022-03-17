import PropTypes from 'prop-types'
import Link from 'next/link'
import {useRouter} from 'next/router'

import colors from '@/styles/colors'
import {ArrowLeftCircle, ArrowRightCircle} from 'react-feather'

function listPages(num) {
  const pageNumbers = []

  for (let i = 0; i < num; i++) {
    pageNumbers.push(i + 1)
  }

  return pageNumbers
}

function BlogPagination({pagination}) {
  const router = useRouter()
  const pageNumbers = listPages(pagination?.pages)
  const href = `${router.route}?page=`
  const tags = router.query?.tags ? `&tags=${router.query.tags}` : ''

  return (
    <>
      <div className='blog-pagination'>
        {pagination?.prev && (
          <Link href={`${href}${pagination.prev}${tags}`}>
            <a className='page'><ArrowLeftCircle style={{verticalAlign: 'middle'}} /></a>
          </Link>
        )}
        {pageNumbers.map(n => {
          return (
            <Link key={n} href={`${href}${n}${tags}`}>
              <a className={pagination.page === n ? 'actual-page page' : 'page'}>{n}</a>
            </Link>
          )
        })}
        {pagination?.next && (
          <Link href={`${href}${pagination.next}${tags}`}>
            <a className='page'><ArrowRightCircle style={{verticalAlign: 'middle'}} /></a>
          </Link>
        )}
      </div>
      <style jsx>{`
        .blog-pagination {
          display: flex;
          justify-content: center;
          padding-top: 2em;
        }

        .blog-pagination a {
          padding: .5em;
        }

        .actual-page {
          border-radius: 5px;
          background-color: ${colors.lighterGrey};
        }
      `}</style>
    </>
  )
}

BlogPagination.defaultProps = {
  pagination: null
}

BlogPagination.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    pages: PropTypes.number,
    next: PropTypes.number,
    prev: PropTypes.number
  })
}

export default BlogPagination
