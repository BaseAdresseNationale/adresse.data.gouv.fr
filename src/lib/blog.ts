import { env } from 'next-runtime-env'

const URL = env('NEXT_PUBLIC_GHOST_URL')
const KEY = env('NEXT_PUBLIC_GHOST_KEY')

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
  next: { revalidate: 900 }, // 15min
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

export async function getPosts(options: PostOptions = {}, fetchInit?: RequestInit) {
  const query = buildQuery(options)
  const opts = fetchInit ? { ...fetchOptions, ...fetchInit } : fetchOptions

  try {
    const res = await fetch(query, opts)
    if (res.ok) {
      return await res.json()
    }
    void res.body?.cancel().catch(() => { })
  }
  catch (error) {
    console.log(error)
  }

  return null
}

export async function getSinglePost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/posts/slug/${slug}/?key=${KEY}&include=authors,tags`, { cache: 'no-store' })

    if (res.ok) {
      const data = await res.json()
      return data.posts[0]
    }
    void res.body?.cancel().catch(() => { })
  }
  catch (error) {
    console.log(error)
  }

  return null
}

export async function getTags(fetchInit?: RequestInit) {
  const opts = fetchInit
    ? { method: 'GET', headers: { 'content-type': 'application/json' }, mode: 'cors' as RequestMode, ...fetchInit }
    : { method: 'GET', headers: { 'content-type': 'application/json' }, mode: 'cors' as RequestMode, next: { revalidate: 900 } }
  try {
    const res = await fetch(`${API_URL}/tags?key=${KEY}`, opts)

    if (res.ok) {
      const data = await res.json()
      return data.tags
    }
    void res.body?.cancel().catch(() => { })
  }
  catch (error) {
    console.log(error)
  }

  return null
}
