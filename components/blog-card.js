import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import colors from '@/styles/colors'

function BlogCard({post, onClick}) {
  const link = onClick ? `/blog/${post.slug}` : `/bases-locales/temoignages/${post.slug}`

  return (
    <div className='blog-container'>
      <Link href={link} passHref>
        <h4 className='blog-title'>{post.title}</h4>
      </Link>
      <div className='blog-image-container'>
        <Image src={post.feature_image} alt={post.title} layout='fill' objectFit='cover' />
      </div>
      <div className='infos-container'>
        <p>Le {new Date(post.published_at).toLocaleDateString('fr-FR')}</p>
      </div>
      <p className='preview'>{post.excerpt}</p>
      {onClick && post.tags && (
        <div className='blog-tags-container'>
          {post.tags.map(tag => (
            <span key={tag.id} onClick={() => onClick(tag.name)}>{tag.name}</span>
          ))}
        </div>
      )}
      <div className='blog-link-container'>
        <Link href={link}><a>Lire l’article</a></Link>
      </div>
      <style jsx>{`
        .blog-container {
          display: flex;
          flex-direction: column;
          gap: .2em;
        }

        .blog-title {
          font-size: 1.2em;
          display: flex;
          align-items: flex-start;
          cursor: pointer;
        }

        .blog-image-container {
          position: relative;
          height: 150px;
          box-shadow: 38px 24px 50px -21px ${colors.lightGrey};
        }

        .blog-tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.2em;
          margin: .5em 0;
        }

        .blog-tags-container span {
          background-color: ${colors.lighterBlue};
          text-decoration: underline;
          cursor: pointer;
          border-radius: 15px;
          padding: 0px 8px;
          font-size: .8em;
          font-style: italic;
        }

        .infos-container {
          display: flex;
          flex-direction: column;
        }

        .infos-container p {
          margin: 0;
          font-size: 0.8em;
          font-style: italic;
          display: flex;
          justify-content: end;
          border-bottom: 2px solid ${colors.blue};
        }

        .preview {
          margin: 0;
          text-align: left;
          font-style: italic;
        }

        .blog-link-container {
          color: ${colors.blue};
          text-decoration: underline;
          cursor: pointer;
        }

        .blog-link-container a {
          padding: .5em;
        }
      `}</style>
    </div>
  )
}

BlogCard.defaultProps = {
  onClick: null
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    feature_image: PropTypes.string.isRequired,
    authors: PropTypes.array.isRequired,
    published_at: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func
}

export default BlogCard
