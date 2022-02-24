import PropTypes from 'prop-types'
import {MessageCircle} from 'react-feather'

import {getPosts} from '@/lib/blog'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import TemoignagesList from '@/components/temoignages'

function Temoignages({posts}) {
  const title = 'Témoignages sur les Bases Adresses Locales'
  const description = 'Découvrez des témoignages de terrain sur les solutions à adopter pour conserver toute la richesse de vos adresses dans une Base Adresse Locale'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<MessageCircle size={56} />} />
      <Section title={description} >
        <TemoignagesList posts={posts.filter(post => post.tags.some(tag => tag.name === 'témoignage'))} />
      </Section>
    </Page>
  )
}

Temoignages.propTypes = {
  posts: PropTypes.array
}

Temoignages.defaultProps = {
  posts: null
}

Temoignages.getInitialProps = async () => {
  const {posts} = await getPosts()
  return {posts}
}

export default Temoignages
