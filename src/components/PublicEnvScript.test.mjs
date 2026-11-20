import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import * as jsxRuntime from 'react/jsx-runtime'
import ts from 'typescript'

function load(file, context) {
  const { outputText } = ts.transpileModule(
    readFileSync(new URL(file, import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } },
  )
  const exports = {}
  runInNewContext(outputText, { exports, ...context })
  return exports
}

test('public environment is read after the request and excludes secrets', async () => {
  const environment = { NEXT_PUBLIC_TEST: 'build', SECRET_TEST: 'secret' }
  let release
  const { PublicEnvScript } = load('./PublicEnvScript.tsx', {
    process: { env: environment },
    require(name) {
      if (name === 'react/jsx-runtime') return jsxRuntime
      if (name === 'next/server') return { connection: () => new Promise(resolve => { release = resolve }) }
      if (name === '@/utils/env') return { PUBLIC_ENV_KEY: '__ENV' }
      throw new Error('Unexpected import: ' + name)
    },
  })

  const rendering = PublicEnvScript()
  environment.NEXT_PUBLIC_TEST = '</script>runtime'
  release()
  const script = (await rendering).props.dangerouslySetInnerHTML.__html
  assert.equal(script, 'window[\'__ENV\'] = {"NEXT_PUBLIC_TEST":"\\u003c/script>runtime"}')
  assert.doesNotMatch(script, /SECRET_TEST|secret/)
})

test('environment reader restricts browser access to public values', () => {
  const window = { __ENV: { NEXT_PUBLIC_TEST: 'runtime', SECRET_TEST: 'secret' } }
  const { env } = load('../utils/env.ts', { window })
  assert.equal(env('NEXT_PUBLIC_TEST'), 'runtime')
  assert.equal(env('NEXT_PUBLIC_MISSING'), undefined)
  assert.throws(() => env('SECRET_TEST'), /not public/)
})

test('environment reader reads current server values', () => {
  const environment = { SECRET_TEST: 'before' }
  const { env } = load('../utils/env.ts', { process: { env: environment } })
  environment.SECRET_TEST = 'after'
  assert.equal(env('SECRET_TEST'), 'after')
})

test('root layout waits for the request before fetching alerts', async () => {
  let release
  let fetched = false
  const { default: RootLayout } = load('../app/layout.tsx', {
    require(name) {
      if (name === 'react/jsx-runtime') return jsxRuntime
      if (name === 'next/server') return { connection: () => new Promise(resolve => { release = resolve }) }
      if (name === '@/lib/api-grist') return { fetchAndProcessAlertesGristData: async () => { fetched = true; return [] } }
      if (name === '@codegouvfr/react-dsfr/next-app-router/getHtmlAttributes') return { createGetHtmlAttributes: () => ({ getHtmlAttributes: () => ({}) }) }
      return {}
    },
  })

  const rendering = RootLayout({ children: null })
  assert.equal(fetched, false)
  release()
  await rendering
  assert.equal(fetched, true)
})

test('atproto route reads its environment value after the request', async () => {
  let release
  let value = 'build'
  const { GET } = load('../app/.well-known/atproto-did/route.tsx', {
    Response,
    require(name) {
      if (name === 'next/server') return { connection: () => new Promise(resolve => { release = resolve }) }
      if (name === '@/utils/env') return { env: () => value }
      throw new Error('Unexpected import: ' + name)
    },
  })

  const rendering = GET()
  value = 'runtime'
  release()
  assert.equal(await (await rendering).text(), 'runtime')
})
