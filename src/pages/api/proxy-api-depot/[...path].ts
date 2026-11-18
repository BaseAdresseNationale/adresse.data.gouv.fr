// Proxy natif (fetch) vers l'API Dépôt : remplace http-proxy-middleware,
// dont la chaîne micromatch/picomatch est vulnérable (GHSA-fc5q-39xc-vjpf).
import { Readable } from 'node:stream'
import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/utils/env'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

// En-têtes hop-by-hop ou recalculés par fetch : à ne pas transmettre
const EXCLUDED_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-length',
])

const EXCLUDED_RESPONSE_HEADERS = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  // fetch décompresse le corps : ces valeurs ne correspondraient plus
  'content-encoding',
  'content-length',
])

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const target = env('NEXT_PUBLIC_API_DEPOT_URL')
  const path = (req.url || '').replace(/^\/api\/proxy-api-depot/, '')

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined || EXCLUDED_REQUEST_HEADERS.has(key)) continue
    for (const item of Array.isArray(value) ? value : [value]) {
      headers.append(key, item)
    }
  }
  headers.set('authorization', `Token ${env('API_DEPOT_TOKEN')}`)

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'

  try {
    const upstream = await fetch(`${target}${path}`, {
      method: req.method,
      headers,
      body: hasBody ? (Readable.toWeb(req) as ReadableStream) : undefined,
      // @ts-expect-error `duplex` est requis par Node pour envoyer un corps en flux
      duplex: hasBody ? 'half' : undefined,
      redirect: 'manual',
    })

    res.status(upstream.status)
    upstream.headers.forEach((value, key) => {
      if (!EXCLUDED_RESPONSE_HEADERS.has(key)) {
        res.setHeader(key, value)
      }
    })

    if (upstream.body) {
      Readable.fromWeb(upstream.body as never).pipe(res)
    }
    else {
      res.end()
    }
  }
  catch (err) {
    console.log(err)
    res.status(502).json({ message: 'Bad Gateway' })
  }
}
