import { computeStats, fetchStatsData } from '@/lib/deploiement-stats'
import { getCachedData } from '@/utils/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const codesCommune = request.nextUrl.searchParams.get('codesCommune') || ''
  const codesCommuneArr = codesCommune.split(',') || []
  const statsData = await getCachedData('stats-data', fetchStatsData, 300)
  const featureCollection = await computeStats(statsData, codesCommuneArr)

  return NextResponse.json(featureCollection)
}
