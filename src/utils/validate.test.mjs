import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript'

function load(file) {
  const { outputText } = ts.transpileModule(
    readFileSync(new URL(file, import.meta.url), 'utf8'),
    { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
  )
  const exports = {}
  runInNewContext(outputText, { exports })
  return exports
}

const { isUUIDv4, isYear } = load('./validate.ts')
const { codeCommuneRegex } = load('./string.ts')

test('isUUIDv4 accepts only a version 4 UUID', () => {
  assert.equal(isUUIDv4('55c7f562-4f6b-4dac-a685-19efd9afe42c'), true)
  for (const value of ['../../district/55c7f562-4f6b-4dac-a685-19efd9afe42c', 'c232ab00-9414-11ec-b3c8-9f6bdeced846', '']) {
    assert.equal(isUUIDv4(value), false, value)
  }
})

test('codeCommuneRegex accepts INSEE codes only', () => {
  for (const value of ['60636', '2A004', '97411']) {
    assert.equal(codeCommuneRegex.test(value), true, value)
  }
  for (const value of ['..%2F..', '6063', '606366', '2C001']) {
    assert.equal(codeCommuneRegex.test(value), false, value)
  }
})

test('isYear accepts four digits only', () => {
  assert.equal(isYear('2026'), true)
  for (const value of ['26', '20266', '2026/../x']) {
    assert.equal(isYear(value), false, value)
  }
})
