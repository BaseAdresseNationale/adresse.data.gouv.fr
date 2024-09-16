import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const URL = publicRuntimeConfig.NEXT_PUBLIC_GHOST_URL
const KEY = publicRuntimeConfig.NEXT_PUBLIC_GHOST_KEY

const LIMIT = 15
const INCLUDE = 'authors,tags'
const LIMITED_FIELDS = [
  'id',
  'title',
  'feature_image',
  'published_at',
  'custom_excerpt',
  'slug',
]
const API_URL = `${URL}/ghost/api/v3/content`

const fetchOptions: RequestInit = {
  method: 'GET',
  headers: { 'content-type': 'application/json' },
  mode: 'cors',
}

function buildTagFilter(tags?: string) {
  if (tags) {
    return '&filter=tags:' + tags.replaceAll(',', '%2Btags:')
  }
  return ''
}

interface PostOptions {
  tags?: string
  limit?: number
  limitFields?: boolean
  fields?: string[]
  page?: number
}

function buildQuery(options: PostOptions = {}) {
  const url = `${API_URL}/posts?key=${KEY}&include=${INCLUDE}`
  const {
    tags,
    limit = LIMIT,
    limitFields,
    fields,
    page,
  } = options

  const customFields = limitFields ? LIMITED_FIELDS : fields

  const computedUrl = `${url}`
    + `&limit=${limit}`
    + `${customFields ? `&fields=${customFields.join(',')}` : ''}`
    + `${page ? `&page=${page}` : ''}`
    + `${buildTagFilter(tags)}`

  return computedUrl
}

export async function getPosts(options: PostOptions = {}) {
  const query = buildQuery(options)

  try {
    const res = await fetch(query, fetchOptions)
    if (res.ok) {
      const data = await res.json()
      return data
    }
  }
  catch (error) {
    console.log(error)
  }

  return null
}

export async function getSinglePost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts/slug/${slug}/?key=${KEY}&include=authors,tags`)

    if (res.ok) {
      const data = await res.json()
      return data.posts[0]
    }
  }
  catch (error) {
    console.log(error)
  }

  return null
}

export async function getTags() {
  try {
    const res = await fetch(`${API_URL}/tags?key=${KEY}`)

    if (res.ok) {
      const data = await res.json()
      return data.tags
    }
  }
  catch (error) {
    console.log(error)
  }

  return null
}
