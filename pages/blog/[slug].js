import PropTypes from 'prop-types'
import Link from 'next/link'
import {BookOpen, ArrowLeftCircle} from 'react-feather'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import Notification from '@/components/notification'

import {getSinglePost} from '@/lib/blog'

function SlugPage({post}) {
  if (!post) {
    return (
      <Page title='Oupss...'>
        <Head title='Le Blog de l’adresse' icon={<BookOpen size={56} />} />
        <Section>
          <Notification>
            <h5>Le blog est actuellement inaccessible</h5>
            <p><i>Merci de réessayer ulterieurement</i></p>
          </Notification>
        </Section>
        <Link href='/'>
          <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
        </Link>
      </Page>
    )
  }

  return (
    <Page title={post.title}>
      <Head title='Le Blog de L’Adresse' icon={<BookOpen size={56} />} />
      <Section background='grey'>
        <Link href='/blog'>
          <a className='blog-back-button'><ArrowLeftCircle size={25} style={{verticalAlign: 'middle', marginRight: '.5em'}} /> Retour</a>
        </Link>
        <div className='blog'>
          <h2>{post.title}</h2>
          <p><i>Publié le {new Date(post.published_at).toLocaleDateString('fr-FR')}</i></p>
          <div className='kg-image-card'>
            <img src={post.feature_image} />
          </div>
          <div className='blog-separator' />
          <div dangerouslySetInnerHTML={{__html: post.html}} /* eslint-disable-line react/no-danger */ />
          <div className='blog-separator' />
        </div>
        <Link href='/blog'>
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
  return {
    props: {
      post
    }
  }
}

export default SlugPage
