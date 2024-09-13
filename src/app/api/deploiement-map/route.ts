import { computeStats, fetchStatsData } from '@/lib/deploiement-stats'
import { getCachedData } from '@/utils/cache'
import { NextRequest, NextResponse } from 'next/server'

const computeGeoJSONData = async () => {
  const statsData = await getCachedData('stats-data', fetchStatsData, 300)
  const featureCollection = await computeStats(statsData, [])

  return featureCollection
}

export async function GET(request: NextRequest) {
  const featureCollection = await getCachedData('computed-geoJSON', computeGeoJSONData)

  return NextResponse.json(featureCollection)
}
