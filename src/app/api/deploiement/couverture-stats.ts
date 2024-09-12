import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const codesCommune = request.nextUrl.searchParams.get('codesCommune') || ''
  const codesCommuneArr = codesCommune.split(',') || []
  const statsData = await useCache('stats-data', 300, fetchStatsData)
  const featureCollection = computeStats(statsData, codesCommuneArr)

  return NextResponse.json(featureCollection)
}
