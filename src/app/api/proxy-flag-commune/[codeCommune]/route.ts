import { getCommuneFlag } from '@/lib/api-blasons-communes'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, props: { params: Promise<{ codeCommune: string }> }) {
  const params = await props.params
  const { codeCommune } = params
  const flagUrl = await getCommuneFlag(codeCommune)

  return NextResponse.json(flagUrl)
}
