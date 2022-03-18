import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import {ArrowLeftCircle} from 'react-feather'
import colors from  '@/styles/colors'

import Section from '@/components/section'

function Post({title, published_at, feature_image, html, backLink}) {
  return (
    <Section>
      <Link href={backLink}>
        <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
      </Link>

      <div className='blog'>
        <h2>{title}</h2>
        <p><i>Publié le {new Date(published_at).toLocaleDateString('fr-FR')}</i></p>
        {feature_image && (
          <div className='blog-feature-image-container'>
            <Image src={feature_image} layout='fill' objectFit='cover' className='blog-feature-image' />
          </div>
        )}
        <div className='blog-separator' />
        <div dangerouslySetInnerHTML={{__html: html}} /* eslint-disable-line react/no-danger */ />
        <div className='blog-separator' />
      </div>

      <Link href={backLink}>
        <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
      </Link>

      <style jsx global>{`
        .blog {
          max-width: 1000px;
          margin: 1em auto;
        }

        .blog-feature-image-container {
          position: relative;
          height: 500px;
          box-shadow: 38px 24px 50px -21px lightGrey;
        }

        .kg-image-card img {
          width: auto;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em auto;
          box-shadow: 38px 24px 50px -21px #C9D3DF;
        }

        .blog-image, .blog-feature-image {
          border-radius: 4px;
        }

        .blog-separator {
          border-bottom: 2px solid #0053B3;
        }

        .blog-back-button {
          vertical-align: middle;
          padding: .5em 1em;
        }

        .blog figcaption {
          font-style: italic;
        }

        .blog figure.kg-card {
          text-align: center;
        }

        .kg-bookmark-card {
          position: relative;
          width: 85%;
          margin: 1em auto;
        }

        .kg-bookmark-card a.kg-bookmark-container {
          display: flex;
          text-decoration: none;
          border-radius: 3px;
          border: 1px solid rgb(124 139 154/25%);
          overflow: hidden;
          color: inherit;
          text-align: left;
        }

        .kg-bookmark-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          flex-basis: 100%;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 20px;
          overflow: hidden;
        }

        .kg-bookmark-thumbnail {
          position: relative;
          flex-grow: 1;
          min-width: 33%;
        }

        .kg-bookmark-title {
          font-size: 1.5 em;
          line-height: 1.4 em;
          font-weight: 600;
        }

        .kg-bookmark-description {
          margin-top: 3px;
          font-size: 14px;
          max-height: 55px;
          overflow-y: hidden;
          opacity: .7;
        }

        .kg-bookmark-metadata {
          display: flex;
          align-items: center;
          margin-top: 22px;
          width: 100%;
          font-weight: 500;
          word-break: break-word;
        }

        .kg-bookmark-icon {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }

        .kg-bookmark-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 0 2px 2px 0;
        }

        .kg-gallery-row {
          contain: content;
          display: grid;
          grid-gap: .5em;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }

        .kg-gallery-image img {
          width: auto;
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: auto;
        }

        .kg-align-center {
          text-align: center;
        }

        .kg-button-card a {
          color: white;
          background-color: ${colors.blue};
          border-radius: 5px;
          font-weight: 1em;
          padding: .5em 1.2em;
          height: 2.4em;
          line-height: 1em;
          margin: auto;
          text-decoration: none;
          transition: all .2s ease;
        }
        `}</style>
    </Section>
  )
}

Post.defaultProps = {
  feature_image: null
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  published_at: PropTypes.string.isRequired,
  feature_image: PropTypes.string,
  html: PropTypes.string.isRequired,
  backLink: PropTypes.string.isRequired
}

export default Post
