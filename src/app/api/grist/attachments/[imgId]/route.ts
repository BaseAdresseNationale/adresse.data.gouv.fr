import { NextRequest, NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_GRIST_API_URL || ''
const DOC_ID = process.env.NEXT_PUBLIC_GRIST_DOC_ID || ''
const API_TOKEN = process.env.GRIST_API_TOKEN || ''

export async function GET(
  _req: NextRequest,
  { params }: { params: { imgId: string } }
) {
  const { imgId } = params
  if (!imgId || !/^\d+$/.test(imgId)) {
    return new NextResponse('Invalid imgId', { status: 400 })
  }

  const gristUrl = `${BASE_URL}/docs/${DOC_ID}/attachments/${imgId}/download`
  const response = await fetch(gristUrl, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  })

  if (!response.ok) {
    return new NextResponse('Image unavailable', { status: response.status })
  }

  const contentType = response.headers.get('Content-Type') ?? 'application/octet-stream'
  const buffer = await response.arrayBuffer()
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
