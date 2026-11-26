import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/utils/env'
import { codeCommuneRegex } from '@/utils/string'
import { encodePathSegment } from '@/utils/url'
import { isYear } from '@/utils/validate'

const NEXT_PUBLIC_API_BAN_URL = env('NEXT_PUBLIC_API_BAN_URL')

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ cog: string, year: string }> },
) {
  const { cog, year } = await props.params

  if (!codeCommuneRegex.test(cog) || !isYear(year)) {
    return NextResponse.json({ message: 'Paramètres invalides' }, { status: 400 })
  }

  const statsUrl = `${NEXT_PUBLIC_API_BAN_URL}/api/certificate/stats/${encodePathSegment(cog)}`

  try {
    const [totalRes, byMonthRes] = await Promise.all([
      fetch(statsUrl),
      fetch(`${statsUrl}/${encodePathSegment(year)}`),
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
