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

export async function GET() {
  const to = Date.now()
  const from = new Date(to - 1000 * 60 * 60 * 24 * 30 * 6) // Last 6 months
  const newsletters: any[] = []
  let count = 0
  let offset = 0

  try {
    do {
      const { campaigns, count: _count } = await customFetch(
        `${env('NEXT_PUBLIC_BREVO_API_URL')}/emailCampaigns?status=sent&limit=30&offset=${offset}&startDate=${from.toISOString()}&endDate=${new Date(
          to
        ).toISOString()}`,
        {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': env('BREVO_API_KEY'),
          } as RequestInit['headers'],
        }
      )

      count = _count
      offset += campaigns.length

      newsletters.push(
        ...campaigns.filter((campaign: any) => campaign.name.includes('adresse.data.gouv.fr'))
      )
    } while (offset < count)

    return NextResponse.json({ newsletters })
  }
  catch (error) {
    console.error('Error fetching campaigns:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}
