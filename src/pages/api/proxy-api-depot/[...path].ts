// Proxy was not working with app router https://github.com/chimurai/http-proxy-middleware/issues/932

import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createProxyMiddleware,
} from 'http-proxy-middleware'

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

const proxy = createProxyMiddleware<NextApiRequest, NextApiResponse>({
  target: process.env.NEXT_PUBLIC_API_DEPOT_URL,
  changeOrigin: true,
  headers: {
    Authorization: `Token ${process.env.API_DEPOT_TOKEN}`,
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
