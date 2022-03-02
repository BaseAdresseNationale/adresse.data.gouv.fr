import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'
import {BookOpen, ArrowLeftCircle} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'

import {getSinglePost} from '@/lib/blog'

function SlugPage({post}) {
  return (
    <Page title={post.title}>
      <Head title='Témoignages sur les Bases Adresses Locales' icon={<BookOpen size={56} />} />
      <Section background='grey'>
        <Link href='/bases-locales/temoignages'>
          <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
        </Link>
        <div className='blog'>
          <h2>{post.title}</h2>
          <p><i>Publié le {new Date(post.published_at).toLocaleDateString('fr-FR')}</i></p>
          <div className='blog-feature-image-container'>
            <Image src={post.feature_image} layout='fill' className='blog-feature-image' />
          </div>
          <div className='blog-separator' />
          <div dangerouslySetInnerHTML={{__html: post.html}} /* eslint-disable-line react/no-danger */ />
          <div className='blog-separator' />
        </div>
        <Link href='/bases-locales/temoignages'>
          <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
        </Link>
      </Section>
    </Page>
  )
}

SlugPage.defaultProps = {
  post: null
}

SlugPage.propTypes = {
  post: PropTypes.object
}

export async function getServerSideProps({query}) {
  const post = await getSinglePost(query.slug)

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    }
  }
}

export default SlugPage
