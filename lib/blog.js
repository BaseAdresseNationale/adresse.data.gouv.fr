const URL = process.env.NEXT_PUBLIC_GHOST_URL
const KEY = process.env.NEXT_PUBLIC_GHOST_KEY

const options = {
  method: 'GET',
  headers: {'content-type': 'application/json'},
  mode: 'cors'
}

export async function getPosts() {
  try {
    const res = await fetch(`${URL}/ghost/api/v3/content/posts?key=${KEY}&include=authors,tags&limit=all`, options)
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }
}

export async function getSinglePost(slug) {
  try {
    const res = await fetch(`${URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${KEY}`)
    if (res.ok) {
      const data = await res.json()
      return data
    }
  } catch (error) {
    console.log(error)
  }
}
