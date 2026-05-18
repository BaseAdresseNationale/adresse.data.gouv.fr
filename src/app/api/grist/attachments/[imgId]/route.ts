import { NextRequest, NextResponse } from 'next/server'
import { env } from 'next-runtime-env'
import { ensureWasmInitialized } from '@/lib/resolve-certificat-commune-logo'
import { Resvg } from '@resvg/resvg-wasm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ imgId: string }> }
) {
  const { imgId } = await params
  if (!imgId || !/^\d+$/.test(imgId)) {
    return new NextResponse('Invalid imgId', { status: 400 })
  }
  const gristUrl = `${env('NEXT_PUBLIC_GRIST_API_URL')}/docs/${env('NEXT_PUBLIC_GRIST_DOC_ID')}/attachments/${imgId}/download`
  const response = await fetch(gristUrl, {
    headers: { Authorization: `Bearer ${env('GRIST_API_TOKEN')}` },
  })
  if (!response.ok) {
    return new NextResponse('Image unavailable', { status: response.status })
  }
  const contentType = response.headers.get('Content-Type') ?? 'application/octet-stream'
  const contentLength = response.headers.get('Content-Length')
  const MAX_SIZE = 2 * 1024 * 1024 // 2 Mo
  if (contentLength && parseInt(contentLength) > MAX_SIZE) {
    return new NextResponse('Image too large', { status: 413 })
  }

  const buffer = await response.arrayBuffer()
  if (buffer.byteLength > MAX_SIZE) {
    return new NextResponse('Image too large', { status: 413 })
  }

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
  if (!ALLOWED_TYPES.includes(contentType)) {
    return new NextResponse('Unsupported file type', { status: 415 })
  }
  if (contentType.includes('svg')) {
    try {
      await ensureWasmInitialized()
      const resvg = new Resvg(new Uint8Array(buffer), {
        fitTo: { mode: 'width', value: 512 },
        background: 'rgba(255,255,255,0)',
      })
      const pngBuf = resvg.render().asPng()
      return new NextResponse(new Uint8Array(pngBuf), {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        },
      })
    }
    catch (error) {
      const errorMessage = 'Échec de l\'affichage de l\'image SVG:' + (error as Error).message
      console.error(errorMessage)
      return new NextResponse(errorMessage, { status: 500 })
    }
  }
  else {
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    })
  }
}
