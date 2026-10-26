import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import { Children, isValidElement } from 'react'
import * as jsxRuntime from 'react/jsx-runtime'
import ts from 'typescript'

const files = ['page.tsx', '../lib/api-ban.ts', '../lib/fetch.ts']
const compiled = Object.fromEntries(files.map(file => [file, ts.transpileModule(
  readFileSync(new URL(file, import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } },
).outputText]))

function loadHome(fetch) {
  const warnings = []
  const components = new Map()
  const environment = { env: key => key === 'NEXT_PUBLIC_API_BAN_URL' ? 'https://ban.example.invalid' : 'true' }
  function load(file, require) {
    const exports = {}
    runInNewContext(compiled[file], { exports, require, fetch, AbortSignal, console: { warn: (...args) => warnings.push(args) } })
    return exports
  }
  const fetchModule = load('../lib/fetch.ts', name => { throw new Error('Unexpected import: ' + name) })
  const api = load('../lib/api-ban.ts', name => {
    if (name === './fetch') return fetchModule
    assert.equal(name, 'next-runtime-env')
    return environment
  })
  const page = load('page.tsx', name => {
    if (name === 'react/jsx-runtime') return jsxRuntime
    if (name === 'next-runtime-env') return environment
    if (name === '@/lib/api-ban') return api
    if (name === '@/lib/blog') return { getPosts: async () => ({ posts: [] }) }
    if (name === '@/utils/pageTitle') return title => ({ title })
    if (name === '@/theme') return { colors: { primary: { main: 'blue' } } }
    if (name.startsWith('@/data/')) return JSON.parse(readFileSync(new URL('../data/' + name.split('/').pop(), import.meta.url), 'utf8'))
    if (name === './page.styles') return { CardContainer: 'div' }
    if (!components.has(name)) components.set(name, () => null)
    if (name === '@codegouvfr/react-dsfr/Card') return { Card: components.get(name) }
    if (name === '@codegouvfr/react-dsfr/Button') return { Button: components.get(name) }
    assert.ok(name.startsWith('@/components/'), 'Unexpected import: ' + name)
    return components.get(name)
  })
  function contains(tree, name) {
    const expected = components.get('@/components/' + name)
    let found = false
    function visit(node) {
      if (!isValidElement(node)) return
      if (node.type === expected) found = true
      Children.forEach(node.props.children, visit)
    }
    visit(tree)
    return found
  }
  return { Home: page.default, api, contains, warnings }
}

async function assertHomeWithoutStatistics(loaded) {
  const tree = await loaded.Home()
  assert.ok(loaded.contains(tree, 'SectionHero'))
  assert.ok(loaded.contains(tree, 'SectionTilesList'))
  assert.equal(loaded.contains(tree, 'SectionQuotes'), false)
  assert.equal(loaded.warnings.length, 1)
}

test('HTTP 503 from BAN statistics does not prevent the home page rendering', async () => {
  await assertHomeWithoutStatistics(loadHome(async () => new Response('Service Unavailable', { status: 503 })))
})

test('a network failure does not prevent the home page rendering', async () => {
  await assertHomeWithoutStatistics(loadHome(async () => { throw new TypeError('fetch failed') }))
})

test('invalid statistics JSON does not prevent the home page rendering', async () => {
  await assertHomeWithoutStatistics(loadHome(async () => new Response('{', { headers: { 'content-type': 'application/json' } })))
})

test('a stalled statistics request is aborted instead of blocking the home page', { timeout: 10000 }, async (t) => {
  const keepAlive = setTimeout(() => {}, 10000)
  t.after(() => clearTimeout(keepAlive))
  let aborted = false
  const loaded = loadHome(async (_url, options) => {
    assert.ok(options.signal instanceof AbortSignal)
    return new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => {
      aborted = true
      reject(options.signal.reason)
    }, { once: true }))
  })
  await assertHomeWithoutStatistics(loaded)
  assert.ok(aborted)
})

for (const count of [0, 1234]) {
  test(`available statistics remain displayed, including a count of ${count}`, async () => {
    const loaded = loadHome(async () => Response.json({ bal: { nbCommunesCouvertes: count } }))
    const tree = await loaded.Home()
    assert.ok(loaded.contains(tree, 'SectionQuotes'))
    assert.equal(loaded.warnings.length, 0)
  })
}

test('the API helpers still reject failures for callers requiring their data', async () => {
  const { api } = loadHome(async () => new Response('Unavailable', { status: 503 }))
  for (const request of [() => api.getStats(), () => api.getAddress('address-id')]) {
    await assert.rejects(request, error => error.status === 503)
  }
})

test('statistics can reappear on the next render after the service recovers', async () => {
  let available = false
  const loaded = loadHome(async () => available
    ? Response.json({ bal: { nbCommunesCouvertes: 1234 } })
    : new Response('Unavailable', { status: 503 }))
  await assertHomeWithoutStatistics(loaded)
  available = true
  assert.ok(loaded.contains(await loaded.Home(), 'SectionQuotes'))
})
