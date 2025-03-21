import { customFetch } from '@/lib/fetch'
import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'

export const dynamic = 'force-dynamic'

// Optin to the newsletter
export async function POST(request: NextRequest) {
  if (!env('BREVO_API_KEY') || !env('NEXT_PUBLIC_BREVO_API_URL')) {
    return NextResponse.json(
      { error: 'BREVO_API_KEY or NEXT_PUBLIC_BREVO_API_URL is not defined in the environment' },
      { status: 500 }
    )
  }
  const requestBody = await request.json()
  const { email } = requestBody
  const options = {
    method: 'POST',
    headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': env('BREVO_API_KEY') } as RequestInit['headers'],
    body: JSON.stringify({ email, listIds: [10] }),
  }

  const response = await customFetch(`${env('NEXT_PUBLIC_BREVO_API_URL')}/contacts`, options)

  return NextResponse.json(response)
}
