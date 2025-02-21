import { env } from 'next-runtime-env'

export async function GET(request: Request) {
  try {
    const BLUESKY_KEY_DNS = env('NEXT_PUBLIC_SOCIAL_NETWORKS_BLUESKY_KEY_DNS')

    if (!BLUESKY_KEY_DNS) {
      throw new Error('Environment variable NEXT_PUBLIC_SOCIAL_NETWORKS_BLUESKY_KEY_DNS is not defined')
    }

    return new Response(`test:${BLUESKY_KEY_DNS}`, { status: 200 })
  } catch (error) {
    console.error('Error in GET /.well-known/atproto-did:', error)

    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
