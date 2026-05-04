import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'
import { Resvg, initWasm } from '@resvg/resvg-wasm'

import { getCommuneFlagProxy } from '@/lib/api-blasons-communes'

export const CERTIFICAT_DEFAULT_LOGO_RELATIVE = 'public/logos/certificat/default.png'

const RESVG_WASM_STANDALONE = join(process.cwd(), '.next', 'standalone', 'node_modules', '@resvg', 'resvg-wasm', 'index_bg.wasm')
const RESVG_WASM_ROOT = join(process.cwd(), 'node_modules', '@resvg', 'resvg-wasm', 'index_bg.wasm')
const RESVG_WASM_FILE = existsSync(RESVG_WASM_STANDALONE) ? RESVG_WASM_STANDALONE : RESVG_WASM_ROOT

let wasmInitializationPromise: Promise<void> | null = null

export function ensureWasmInitialized(): Promise<void> {
  if (!wasmInitializationPromise) {
    wasmInitializationPromise = readFile(RESVG_WASM_FILE).then(wasmBinary => initWasm(wasmBinary))
  }
  return wasmInitializationPromise
}

function toDataUri(mimeType: string, buffer: Buffer): string {
  return `data:${mimeType};base64,${buffer.toString('base64')}`
}

function parseSvgDataUri(dataUri: string): Buffer | null {
  const separatorIndex = dataUri.indexOf(',')
  if (separatorIndex <= 0) return null

  const metadata = dataUri.slice(0, separatorIndex).toLowerCase()
  const payload = dataUri.slice(separatorIndex + 1)
  const isBase64 = metadata.includes(';base64')
  try {
    return isBase64
      ? Buffer.from(payload, 'base64')
      : Buffer.from(decodeURIComponent(payload), 'utf8')
  }
  catch {
    return null
  }
}

function isSvgBuffer(buffer: Buffer): boolean {
  return /<svg[\s>]/i.test(buffer.subarray(0, 512).toString('utf8'))
}

export function resolveCertificatCommuneLogoPath(_codeCommune: string): string {
  return CERTIFICAT_DEFAULT_LOGO_RELATIVE
}

async function svgToPngDataUri(buf: Buffer): Promise<string | null> {
  try {
    await ensureWasmInitialized()
    const resvg = new Resvg(new Uint8Array(buf), {
      fitTo: { mode: 'width', value: 512 },
      background: 'rgba(255,255,255,0)',
    })
    const pngBuf = Buffer.from(resvg.render().asPng())
    return toDataUri('image/png', pngBuf)
  }
  catch {
    return null
  }
}

export async function resolveCertificatCommuneLogoForGeneration(codeCommune: string): Promise<string> {
  const url = (await getCommuneFlagProxy(codeCommune)).trim()

  if (url.startsWith('data:image/svg+xml')) {
    const svgBuffer = parseSvgDataUri(url)
    if (!svgBuffer) return resolveCertificatCommuneLogoPath(codeCommune)
    const dataUri = await svgToPngDataUri(svgBuffer)
    return dataUri ?? resolveCertificatCommuneLogoPath(codeCommune)
  }

  if (url.startsWith('data:image/')) {
    return url
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return resolveCertificatCommuneLogoPath(codeCommune)
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; adresse.data.gouv.fr/1.0)' },
      redirect: 'follow',
    })
    if (!res.ok) return resolveCertificatCommuneLogoPath(codeCommune)

    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length === 0) return resolveCertificatCommuneLogoPath(codeCommune)

    const ct = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
    const isSvg = ct.includes('svg') || /\.svg(\?|$)/i.test(url) || isSvgBuffer(buf)

    if (isSvg) {
      const dataUri = await svgToPngDataUri(buf)
      return dataUri ?? resolveCertificatCommuneLogoPath(codeCommune)
    }

    return toDataUri(ct || 'image/png', buf)
  }
  catch {
    return resolveCertificatCommuneLogoPath(codeCommune)
  }
}
