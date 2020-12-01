import GhostContentAPI from '@tryghost/content-api'

const api = new GhostContentAPI({
  url: process.env.NEXT_PUBLIC_GHOST_URL,
  key: process.env.NEXT_PUBLIC_GHOST_KEY,
  version: 'v3'
})

export async function getPosts() {
  return api.posts
    .browse({
      limit: 'all'
    })
    .catch(err => {
      console.error(err)
    })
}

export async function getSinglePost(postSlug) {
  return api.posts
    .read({
      slug: postSlug
    })
    .catch(err => {
      console.error(err)
    })
}
