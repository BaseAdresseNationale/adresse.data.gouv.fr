import { customFetch } from '@/lib/fetch'
import { NextRequest, NextResponse } from 'next/server'

// Optin to the newsletter
export async function POST(request: NextRequest) {
  const requestBody = await request.json()
  const { email } = requestBody
  const options = {
    method: 'POST',
    headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': process.env.BREVO_API_KEY } as RequestInit['headers'],
    body: JSON.stringify({ email, listIds: [10] }),
  }

  const response = await customFetch(`${process.env.NEXT_PUBLIC_BREVO_API_URL}/contacts`, options)

  return NextResponse.json(response)
}