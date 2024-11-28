// Proxy was not working with app router https://github.com/chimurai/http-proxy-middleware/issues/932

import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createProxyMiddleware,
} from 'http-proxy-middleware'
import { env } from 'next-runtime-env'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

const proxy = createProxyMiddleware<NextApiRequest, NextApiResponse>({
  target: env('NEXT_PUBLIC_API_DEPOT_URL'),
  changeOrigin: true,
  headers: {
    Authorization: `Token ${env('API_DEPOT_TOKEN')}`,
  },
  pathRewrite: {
    '^/api/proxy-api-depot': '',
  },
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return proxy(req, res, (err: Error) => {
    if (err) {
      console.log(err)
    }

    return res
  })
}
