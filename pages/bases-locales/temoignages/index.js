import PropTypes from 'prop-types'
import {MessageCircle} from 'react-feather'

import {getPosts} from '@/lib/blog'

import Page from '@/layouts/main'
import Head from '@/components/head'
import Section from '@/components/section'
import TemoignagesList from '@/components/temoignages'
import Notification from '@/components/notification'

function Temoignages({posts, pagination}) {
  const title = 'Témoignages sur les Bases Adresses Locales'
  const description = 'Découvrez des témoignages de terrain sur les solutions à adopter pour conserver toute la richesse de vos adresses dans une Base Adresse Locale'

  return (
    <Page title={title} description={description}>
      <Head title={title} icon={<MessageCircle size={56} alt='' aria-hidden='true' />} />
      <Section title={description}>
        {posts ? (
          <TemoignagesList pagination={pagination} posts={posts} />
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
  posts: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired
}

export async function getServerSideProps({query}) {
  const data = await getPosts({...query, limitFields: true, tags: 'temoignage'})
  return {
    props: {
      posts: data.posts,
      pagination: data.meta.pagination
    }
  }
}

export default Temoignages
