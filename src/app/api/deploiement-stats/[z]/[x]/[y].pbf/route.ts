import { computeStats, fetchStatsData } from '@/lib/deploiement-stats'
import { getCachedData } from '@/utils/cache'
import { NextRequest, NextResponse } from 'next/server'
import geojsonVt from 'geojson-vt'
// @ts-ignore
import vtpbf from 'vt-pbf'

const computeTiles = async () => {
  const statsData = await getCachedData('stats-data', fetchStatsData)
  const featureCollection = await computeStats(statsData, [])

  return geojsonVt(featureCollection as geojsonVt.Data, { indexMaxZoom: 9 })
}

export async function GET(request: NextRequest, { params }: { params: { x: string, y: string, z: string } }) {
  const tiles = await getCachedData('deploiement-tiles', computeTiles)

  const z = Number.parseInt(params.z, 10)
  const x = Number.parseInt(params.x, 10)
  const y = Number.parseInt(params.y, 10)

  const tile = tiles.getTile(z, x, y)

  if (z > 14 || !tile) {
    return new Response('', { status: 200 })
  }

  const pbf = vtpbf.fromGeojsonVt({ communes: tile })

  return new NextResponse(pbf, { headers: { 'Content-Type': 'application/x-protobuf' } })
}
