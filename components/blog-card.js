import PropTypes from 'prop-types'
import Image from 'next/image'
import {useRouter} from 'next/router'

import colors from '@/styles/colors'

function BlogCard({post, onClick}) {
  const router = useRouter()

  const link = onClick ? '/blog/' : '/bases-locales/temoignages/'

  return (
    <div className='blog-container'>
      <h4 className='blog-title'>{post.title}</h4>
      <div className='blog-image-container'>
        {post.feature_image && (
          <Image src={post.feature_image} alt={post.title} layout='fill' className='blog-image' />
        )}
      </div>
      <div className='infos-container'>
        <p><span>Rédigé par {post.authors[0].name}</span> <span>Le {new Date(post.published_at).toLocaleDateString('fr-FR')}</span></p>
      </div>
      <p className='preview'>{post.excerpt}</p>
      {onClick && (
        <div className='blog-tags-container'>
          {post.tags && (
            post.tags.map(tag => (
              <a key={tag.id} onClick={() => onClick(tag.name)}>{tag.name}</a>
            ))
          )}
        </div>
      )}
      <div className='blog-link-container'>
        <div onClick={() => router.push(`${link}${post.slug}`)}>Lire l’article</div>
      </div>
      <style jsx>{`
        .blog-container {
          display: grid;
          grid-template-rows: 50px 150px 30px 1fr auto 0.5fr;
          text-align: left;
          margin-top: 3em;
        }

        .blog-title {
          font-size: 1.2em;
          margin-bottom: 0.5em;
          display: flex;
          align-items: flex-end;
        }

        .blog-image-container {
          position: relative;
          box-shadow: 38px 24px 50px -21px ${colors.lightGrey};
        }

        .blog-tags-container {
          padding: .5em 0;
          display: flex;
          flex-wrap: wrap;
        }

        .blog-tags-container a {
          background-color: ${colors.lighterBlue};
          border-radius: 15px;
          padding: 0px 8px;
          margin: 3px;
          font-size: .8em;
          font-style: italic;
        }

        .infos-container {
          display: flex;
          flex-direction: column;
          text-align: right;
        }

        .infos-container p {
          margin: 0;
          font-size: 0.8em;
          font-style: italic;
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid ${colors.blue};
        }

        .preview {
          margin: 0;
          text-align: left;
          font-style: italic;
        }

        .blog-link-container {
          margin-top: 0.6em;
          color: ${colors.blue};
          text-decoration: underline;
        }

        .blog-link-container:hover {
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

BlogCard.defaultProps = {
  onClick: null
}

BlogCard.propTypes = {
  post: PropTypes.object.isRequired,
  onClick: PropTypes.func
}

export default BlogCard
