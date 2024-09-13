import { NextResponse } from 'next/server'
import communesIndex from '../../../../../public/communes-index.json'

export async function GET(request: Request, { params }: { params: { codeCommune: string } }
) {
  return NextResponse.json((communesIndex as Record<string, any>)[params.codeCommune] || {})
}
