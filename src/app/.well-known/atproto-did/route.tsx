import { env } from 'next-runtime-env'

const BLUESKY_KEY_DNS = env('NEXT_PUBLIC_SOCIAL_NETWORKS_BLUESKY_KEY_DNS')

export async function GET(request: Request) {
  return new Response(`${BLUESKY_KEY_DNS}`)
}
