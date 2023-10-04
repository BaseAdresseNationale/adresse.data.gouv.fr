const URL = process.env.NEXT_PUBLIC_GHOST_URL
const KEY = process.env.GHOST_KEY
const LIMIT = 9
const INCLUDE = 'authors,tags'

const LIMITED_FIELDS = [
  'id',
  'title',
  'feature_image',
  'published_at',
  'custom_excerpt',
  'slug',
]

const FULL_URL = `${URL}/ghost/api/v3/content/posts?key=${KEY}&include=${INCLUDE}`

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

function buildQuery(props = {}) {
  const {tags, limit = LIMIT, limitFields, fields, page} = props
  const customFields = limitFields ? LIMITED_FIELDS : fields

  const computedUrl = `${FULL_URL}` +
    `&limit=${limit}` +
    `${customFields ? `&fields=${customFields.join(',')}` : ''}` +
    `${page ? `&page=${page}` : ''}` +
    `${buildTagFilter(tags)}`

  return computedUrl
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
    const res = await fetch(`${URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${KEY}&include=authors`)

    if (res.ok) {
      const data = await res.json()
      return data.posts[0]
    }
  } catch (error) {
    console.log(error)
  }

  return null
}

export async function getTags() {
  try {
    const res = await fetch(`${URL}/ghost/api/v3/content/tags?key=${KEY}`)

    if (res.ok) {
      const data = await res.json()
      return data.tags
    }
  } catch (error) {
    console.log(error)
  }

  return null
}
