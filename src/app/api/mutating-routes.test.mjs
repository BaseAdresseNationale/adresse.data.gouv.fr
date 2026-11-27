import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const API_DIR = fileURLToPath(new URL('.', import.meta.url))
const MUTATING_EXPORT = /export\s+(?:async\s+function|const)\s+(?:POST|PUT|PATCH|DELETE)\b/g
const GUARD_CALL = /rejectCrossSiteRequest\(/g

const routeFiles = readdirSync(API_DIR, { recursive: true })
  .filter(path => /(^|[\\/])route\.tsx?$/.test(path))

test('every mutating route handler starts with the cross-site guard', () => {
  assert.ok(routeFiles.length > 10, `routes trouvées : ${routeFiles.length}`)

  for (const path of routeFiles) {
    const source = readFileSync(join(API_DIR, path), 'utf8')
    const mutatingHandlers = source.match(MUTATING_EXPORT)?.length ?? 0
    const guardCalls = source.match(GUARD_CALL)?.length ?? 0
    assert.ok(guardCalls >= mutatingHandlers, `${path} : ${mutatingHandlers} handler(s) d'écriture, ${guardCalls} appel(s) à rejectCrossSiteRequest`)
  }
})
