import assert from 'node:assert/strict'
import test from 'node:test'
import nextServer from 'next/server.js'
import { SITE, loadRequestGuardModule } from '../test-utils/auth-modules.mjs'

const { rejectCrossSiteRequest } = loadRequestGuardModule({ nextServer })

const post = headers => new Request(`${SITE}/api/favorites`, { method: 'POST', headers, body: '{}' })

test('a call that is not JSON from the site itself is refused with 403', async () => {
  const refused = [
    ['foreign Origin', { 'Origin': 'https://evil.example', 'Content-Type': 'application/json' }],
    ['sibling subdomain', { 'Origin': 'https://sous.site.example', 'Content-Type': 'application/json' }],
    ['missing Origin', { 'Content-Type': 'application/json' }],
    ['null Origin', { 'Origin': 'null', 'Content-Type': 'application/json' }],
    ['text/plain', { 'Origin': SITE, 'Content-Type': 'text/plain' }],
    ['form', { 'Origin': SITE, 'Content-Type': 'application/x-www-form-urlencoded' }],
    ['multipart', { 'Origin': SITE, 'Content-Type': 'multipart/form-data; boundary=x' }],
    ['missing Content-Type', { Origin: SITE }],
  ]
  for (const [label, headers] of refused) {
    const response = rejectCrossSiteRequest(post(headers))
    assert.equal(response?.status, 403, label)
    assert.deepEqual(await response.json(), { error: 'Forbidden' }, label)
  }
})

test('a JSON call from the site passes, whatever the media type parameters', () => {
  for (const contentType of ['application/json', 'application/json; charset=utf-8', 'Application/JSON']) {
    assert.equal(rejectCrossSiteRequest(post({ 'Origin': SITE, 'Content-Type': contentType })), null, contentType)
  }
})
