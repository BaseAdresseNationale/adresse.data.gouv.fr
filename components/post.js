import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import {ArrowLeftCircle} from 'react-feather'

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
        <div className='blog-feature-image-container'>
          <Image src={feature_image} layout='fill' objectFit='cover' className='blog-feature-image' />
        </div>
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
        `}</style>
    </Section>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  published_at: PropTypes.string.isRequired,
  feature_image: PropTypes.string.isRequired,
  html: PropTypes.string.isRequired,
  backLink: PropTypes.string.isRequired
}

export default Post
