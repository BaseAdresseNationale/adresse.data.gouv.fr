const URL = process.env.NEXT_PUBLIC_GHOST_URL
const KEY = process.env.GHOST_KEY
const LIMIT = 9
const INCLUDE = 'authors,tags'
const FULL_URL = `${URL}/ghost/api/v3/content/posts?key=${KEY}&limit=${LIMIT}&include=${INCLUDE}`

const options = {
  method: 'GET',
  headers: {'content-type': 'application/json'},
  mode: 'cors'
}

function buildTagFilter(tags) {
  if (tags) {
    return '&filter=tags:' + tags.replaceAll(',', '%2Btags:')
  }

  return ''
}

function buildQuery(props) {
  const tagsFilter = props?.tags ? buildTagFilter(props.tags) : ''

  if (props?.page && props.page.length > 0) {
    return `${FULL_URL}&page=${props.page}${tagsFilter}`
  }

  return `${FULL_URL}${tagsFilter}`
}

export async function getPosts(props) {
  const query = buildQuery(props)

  try {
    const res = await fetch(query, options)
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }

  return null
}

export async function getSinglePost(slug) {
  try {
    const res = await fetch(`${URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${KEY}`)

    if (res.ok) {
      const data = await res.json()
      return data.posts[0]
    }
  } catch (error) {
    console.log(error)
  }

  return null
}
