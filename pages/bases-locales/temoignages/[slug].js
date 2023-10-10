import PropTypes from 'prop-types'
import {BookOpen} from 'react-feather'

import {getSinglePost} from '@/lib/blog'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Post from '@/components/post'

function SlugPage({post}) {
  return (
    <Page title={post.title} description={post.custom_excerpt} image={post.feature_image}>
      <Head title='Témoignages sur les Bases Adresses Locales' icon={<BookOpen size={56} alt='' aria-hidden='true' />} />
      <Post {...post} backLink='/bases-locales/temoignages' />
    </Page>
  )
}

SlugPage.defaultProps = {
  post: null
}

SlugPage.propTypes = {
  /* eslint-disable camelcase */
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    custom_excerpt: PropTypes.string.isRequired,
    feature_image: PropTypes.string
  })
  /* eslint-enable camelcase */
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
