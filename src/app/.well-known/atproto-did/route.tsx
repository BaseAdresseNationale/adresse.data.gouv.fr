import { env } from '@/utils/env'
import { connection } from 'next/server'

export async function GET() {
    await connection()
    const BLUESKY_KEY_DNS = env('NEXT_PUBLIC_SOCIAL_NETWORKS_BLUESKY_KEY_DNS')
    return new Response(`${BLUESKY_KEY_DNS}`, { status: 200 })
}
