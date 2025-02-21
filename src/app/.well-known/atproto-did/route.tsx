import { env } from 'next-runtime-env'

export async function GET(request: Request) {
    const BLUESKY_KEY_DNS = env('NEXT_PUBLIC_SOCIAL_NETWORKS_BLUESKY_KEY_DNS')
    return new Response(`${BLUESKY_KEY_DNS}`, { status: 200 })
}
