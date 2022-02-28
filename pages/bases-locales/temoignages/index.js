import PropTypes from 'prop-types'
import {MessageCircle} from 'react-feather'

import {getPosts} from '@/lib/blog'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import TemoignagesList from '@/components/temoignages'
import Notification from '@/components/notification'

function Temoignages({posts}) {
  const title = 'Témoignages sur les Bases Adresses Locales'
  const description = 'Découvrez des témoignages de terrain sur les solutions à adopter pour conserver toute la richesse de vos adresses dans une Base Adresse Locale'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<MessageCircle size={56} />} />
      <Section title={description} >
        {posts ? (
          <TemoignagesList posts={posts?.filter(post => post.tags.some(tag => tag.name === 'témoignage'))} />
        ) : (
          <Notification>
            <h5>Les témoignages sont actuellement inaccessibles</h5>
            <p><i>Merci de réessayer ulterieurement</i></p>
          </Notification>
        )}
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

export async function getServerSideProps() {
  const posts = await getPosts()
  return {
    props: {
      posts
    }
  }
}

export default Temoignages
