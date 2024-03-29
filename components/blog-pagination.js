import PropTypes from 'prop-types'
import Link from 'next/link'
import {useRouter} from 'next/router'

import colors from '@/styles/colors'
import {ArrowLeftCircle, ArrowRightCircle} from 'react-feather'

function BlogPagination({page, pages, prev, next}) {
  const router = useRouter()
  const pageNumbers = Array.from({length: pages}, (v, i) => i + 1)
  const href = `${router.route}?page=`
  const tags = router.query?.tags ? `&tags=${router.query.tags}` : ''

  return (
    <>
      <div className='blog-pagination' role='navigation'>
        {prev && (
          <Link href={`${href}${prev}${tags}`} legacyBehavior>
            <a className='page' aria-label='Aller à la page précédente'><ArrowLeftCircle style={{verticalAlign: 'middle'}} alt='' aria-hidden='true' /></a>
          </Link>
        )}
        {pageNumbers.map(n => (
          <Link key={n} href={`${href}${n}${tags}`} legacyBehavior>
            <a
              className={page === n ? 'actual-page page' : 'page'}
              aria-label={`${page === n ? `Vous êtes sur la page ${n}` : `Aller à la page ${n}`}`}
            >
              {n}
            </a>
          </Link>
        ))}
        {next && (
          <Link href={`${href}${next}${tags}`} legacyBehavior>
            <a className='page' aria-label='Aller à la page suivante'><ArrowRightCircle style={{verticalAlign: 'middle'}} alt='' aria-hidden='true' /></a>
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

BlogPagination.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  next: PropTypes.number,
  prev: PropTypes.number
}

export default BlogPagination
