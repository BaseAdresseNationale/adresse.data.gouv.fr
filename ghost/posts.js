import GhostContentAPI from '@tryghost/content-api'

const apiInfos = {
  url: process.env.NEXT_PUBLIC_GHOST_URL,
  key: process.env.NEXT_PUBLIC_GHOST_KEY,
  version: 'v3'
}

export async function getPosts() {
  if (process.env.NEXT_PUBLIC_GHOST_URL && process.env.NEXT_PUBLIC_GHOST_KEY) {
    return new GhostContentAPI(apiInfos).posts
      .browse({
        limit: 'all'
      })
      .catch(err => {
        console.error(err)
      })
  }
}

export async function getSinglePost(postSlug) {
  if (process.env.NEXT_PUBLIC_GHOST_URL && process.env.NEXT_PUBLIC_GHOST_KEY) {
    return new GhostContentAPI(apiInfos).posts
      .read({
        include: 'authors',
        slug: postSlug
      })
      .catch(err => {
        console.error(err)
      })
  }
}
