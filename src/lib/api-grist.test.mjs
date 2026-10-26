import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

// Transpile the actual module and isolate its environment and network calls.
const { outputText } = ts.transpileModule(
  readFileSync(new URL('./api-grist.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
)
const configuration = {
  NEXT_PUBLIC_GRIST_API_URL: 'https://grist.example.invalid',
  NEXT_PUBLIC_GRIST_DOC_ID: 'applications',
  NEXT_PUBLIC_GRIST_DOC_BANDEAU_ID: 'editorial',
  NEXT_PUBLIC_GRIST_TABLE_ID: 'Applications',
  GRIST_API_TOKEN: 'test-token',
}
const readers = [
  'fetchAndProcessAlertesGristData',
  'fetchAndProcessActusGristData',
  'fetchAndProcessEventsGristData',
  'fetchAndProcessApplicationGristData',
  'fetchTagColumn',
]

function loadGrist(fetch, overrides = {}) {
  const exports = {}
  const errors = []
  runInNewContext(outputText, {
    exports,
    require(name) {
      assert.equal(name, 'next-runtime-env')
      return { env: key => ({ ...configuration, ...overrides })[key] }
    },
    fetch,
    URLSearchParams,
    AbortSignal,
    console: { error: (...args) => errors.push(args) },
  })
  return { api: exports, errors }
}

async function assertEmptyReaders(api) {
  for (const reader of readers) {
    const result = await api[reader]()
    assert.ok(Array.isArray(result), reader)
    assert.equal(result.length, 0, reader)
  }
}

for (const code of ['ECONNREFUSED', 'ENOTFOUND']) {
  test(`Grist ${code} does not propagate to any page reader`, async () => {
    const { api, errors } = loadGrist(async () => {
      throw Object.assign(new TypeError('fetch failed'), { cause: { code } })
    })
    await assertEmptyReaders(api)
    assert.ok(errors.length > 0)
  })
}

test('HTTP errors return empty content for all page readers', async () => {
  const { api, errors } = loadGrist(async () => new Response('Unavailable', { status: 503 }))
  await assertEmptyReaders(api)
  assert.ok(errors.length > 0)
})

test('invalid JSON does not propagate to page rendering', async () => {
  const { api, errors } = loadGrist(async () => new Response('<html>Unavailable</html>'))
  await assertEmptyReaders(api)
  assert.ok(errors.length > 0)
})

for (const phase of ['headers', 'body']) {
  test(`a stalled ${phase} is aborted for both records and columns`, { timeout: 10000 }, async (t) => {
    // AbortSignal.timeout uses an unref'ed timer; a real fetch has an open socket.
    const keepAlive = setTimeout(() => {}, 10000)
    t.after(() => clearTimeout(keepAlive))
    let aborts = 0
    const { api } = loadGrist(async (_url, options) => {
      assert.ok(options.signal instanceof AbortSignal)
      const stalled = new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          aborts++
          reject(options.signal.reason)
        }, { once: true })
      })
      return phase === 'headers' ? stalled : { ok: true, json: () => stalled }
    })
    const results = await Promise.all([api.fetchAndProcessAlertesGristData(), api.fetchTagColumn()])
    for (const result of results) assert.equal(result.length, 0)
    assert.equal(aborts, 2)
  })
}

test('missing URL or document configuration skips network calls', async () => {
  for (const overrides of [
    { NEXT_PUBLIC_GRIST_API_URL: '' },
    { NEXT_PUBLIC_GRIST_DOC_ID: '', NEXT_PUBLIC_GRIST_DOC_BANDEAU_ID: '' },
  ]) {
    let calls = 0
    const { api } = loadGrist(async () => { calls++; throw new Error('Unexpected fetch') }, overrides)
    await assertEmptyReaders(api)
    assert.equal(calls, 0)
  }
})

test('healthy Grist still supplies active alerts and tag choices', async () => {
  const now = Date.now() / 1000
  const { api, errors } = loadGrist(async (url) => {
    if (url.endsWith('/columns')) {
      return Response.json({ columns: [{ id: 'tags_application', fields: { widgetOptions: JSON.stringify({ choices: ['BAN', 'BAL'] }) } }] })
    }
    return Response.json({ records: [
      { id: 1, fields: { type: 'warning', message: 'Maintenance', date_debut: now - 60, date_fin: now + 60 } },
      { id: 2, fields: { type: 'alert', message: 'Prioritaire', date_debut: now - 60, date_fin: now + 60 } },
      { id: 3, fields: { type: 'info', message: 'Expirée', date_debut: now - 120, date_fin: now - 60 } },
    ] })
  })
  const alerts = await api.fetchAndProcessAlertesGristData()
  assert.deepEqual(Array.from(alerts, alert => alert.message), ['Prioritaire', 'Maintenance'])
  assert.deepEqual(Array.from(await api.fetchTagColumn()), ['BAN', 'BAL'])
  assert.equal(errors.length, 0)
})

test('invalid tag metadata is ignored without breaking the news page', async () => {
  const { api } = loadGrist(async () => Response.json({ columns: [{ id: 'tags_application', fields: { widgetOptions: '{' } }] }))
  assert.equal((await api.fetchTagColumn()).length, 0)
})

test('the next request can load Grist content after an outage', async () => {
  let available = false
  const { api } = loadGrist(async () => {
    if (!available) throw new TypeError('fetch failed')
    return Response.json({ columns: [{ id: 'tags_application', fields: { widgetOptions: '{"choices":["BAN"]}' } }] })
  })
  assert.equal((await api.fetchTagColumn()).length, 0)
  available = true
  assert.deepEqual(Array.from(await api.fetchTagColumn()), ['BAN'])
})
