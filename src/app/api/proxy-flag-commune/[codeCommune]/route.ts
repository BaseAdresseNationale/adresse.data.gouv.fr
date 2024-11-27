import { getCommuneFlag } from '@/lib/api-blasons-communes'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { codeCommune: string } }) {
  const { codeCommune } = params
  const flagUrl = await getCommuneFlag(codeCommune)

  return NextResponse.json(flagUrl)
}
