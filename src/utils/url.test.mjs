import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

const { outputText } = ts.transpileModule(
  readFileSync(new URL('./url.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
)
const exports = {}
runInNewContext(outputText, { exports, URL })
const { encodePathSegment, toInternalPath } = exports

test('encodePathSegment refuses segments that change the path', () => {
  for (const value of ['', '.', '..']) {
    assert.throws(() => encodePathSegment(value), { message: /Segment de chemin invalide/ }, JSON.stringify(value))
  }
})

test('encodePathSegment keeps separators inside the segment', () => {
  assert.equal(encodePathSegment('../../district/x'), '..%2F..%2Fdistrict%2Fx')
  assert.equal(encodePathSegment('a?b#c'), 'a%3Fb%23c')
  assert.equal(encodePathSegment('60636'), '60636')
})

test('toInternalPath sends every external or ambiguous target back to the home page', () => {
  const values = [
    'https://faux.example',
    '//faux.example',
    '/%5Cfaux.example',
    '/%2Ffaux.example',
    '/\\faux.example',
    '@faux.example',
    '.faux.example',
    '/\t/faux.example',
    '/\n/faux.example',
    '/.//faux.example',
    '/..//faux.example',
    '/%2e//faux.example',
    '',
    null,
    undefined,
  ]
  for (const value of values) {
    assert.equal(toInternalPath(value), '/', JSON.stringify(value))
  }
})

test('toInternalPath keeps internal paths with their query and fragment', () => {
  for (const value of ['/admin', '/admin?reason=session_expired', '/admin#mon_compte', '/commune/60636']) {
    assert.equal(toInternalPath(value), value)
  }
})
