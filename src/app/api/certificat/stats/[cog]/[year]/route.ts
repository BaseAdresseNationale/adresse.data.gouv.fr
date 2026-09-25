import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')
const BAN_API_TOKEN = env('BAN_API_TOKEN')

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ cog: string, year: string }> },
) {
  const { cog, year } = await props.params

  try {
    const [totalRes, byMonthRes] = await Promise.all([
      fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/stats/${cog}`, {
        headers: {
            'Authorization': `Token ${BAN_API_TOKEN}`,
        },
      }),
      fetch(`${NEXT_PUBLIC_API_BAN_URL}/api/certificate/stats/${cog}/${year}`, {
        headers: {
            'Authorization': `Token ${BAN_API_TOKEN}`,
        },
      }),
    ])

    if (!totalRes.ok || !byMonthRes.ok) {
      return NextResponse.json({ message: 'Erreur lors de la récupération des statistiques' }, { status: 502 })
    }

    const totalJson = await totalRes.json()
    const byMonthJson = await byMonthRes.json()

    return NextResponse.json({
      total: totalJson.response.count,
      byMonth: byMonthJson.response,
    })
  }
  catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Erreur interne' }, { status: 500 })
  }
}