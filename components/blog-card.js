import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'

import colors from '@/styles/colors'

import ActionButtonNeutral from '@/components/action-button-neutral'

function BlogCard({post, onClick}) {
  const link = onClick ? `/blog/${post.slug}` : `/bases-locales/temoignages/${post.slug}`

  return (
    <div className='blog-container'>
      <Link href={link} passHref>
        <h2 className='blog-title'>{post.title}</h2>
      </Link>
      <div className='blog-image-container'>
        <Image src={post.feature_image || '/images/no-img.png'} alt aria-hidden='true' layout='fill' objectFit={post.feature_image ? 'cover' : 'contain'} />
      </div>
      <div className='infos-container'>
        <p>Publié par {post.authors[0].name}</p>
        <p>Le {new Date(post.published_at).toLocaleDateString('fr-FR')}</p>
      </div>
      <p className='preview'>{post.excerpt}</p>
      {onClick && post.tags && (
        <div className='blog-tags-container'>
          {post.tags.map(tag => (
            <ActionButtonNeutral label={`Sélectionner le tag ${tag.name}`} key={tag.id} onClick={() => onClick(tag)}>
              <div className='tag'>{tag.name}</div>
            </ActionButtonNeutral>
          ))}
        </div>
      )}
      <div className='blog-link-container'>
        <Link href={link}>
          <a aria-label={`Lire l’article ${post.title}`}>Lire l’article</a>
        </Link>
      </div>

      <style jsx>{`
        .blog-container {
          display: grid;
          grid-template-rows: 70px .5fr 33px 0fr 0fr 0fr;
          gap: .2em;
        }

        .blog-title {
          font-size: 1.2em;
          display: flex;
          align-items: center;
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

        .tag {
          height: fit-content;
          background-color: ${colors.lighterBlue};
          text-decoration: underline;
          border-radius: 15px;
          padding: 5px 8px;
          font-style: oblique;
        }

        .infos-container {
          display: flex;
          justify-content: space-between;
          padding-top: .5em;
          border-bottom: 2px solid ${colors.blue};
        }

        .infos-container p {
          margin: 0;
          font-size: 0.8em;
          font-style: italic;
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

        h4 {
          margin: 0;
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
    feature_image: PropTypes.string,
    authors: PropTypes.array.isRequired,
    published_at: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func
}

export default BlogCard
