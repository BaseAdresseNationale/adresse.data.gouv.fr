'use server'
import node_fetch from 'node-fetch'
import { HttpsProxyAgent } from 'https-proxy-agent'

const {
  HTTP_PROXY: HTTP_PROXY,
} = process.env

export async function customProxyFetch(url: string) {
  const agent = HTTP_PROXY ? new HttpsProxyAgent(HTTP_PROXY) : undefined
  return node_fetch(url, { agent })
}
