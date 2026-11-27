import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const API_DIR = fileURLToPath(new URL('.', import.meta.url))
const MUTATING_HANDLER = /export\s+(?:async\s+function|const)\s+(POST|PUT|PATCH|DELETE)\b/g
const BODY_START = /\)\s*(?:=>\s*)?\{/g
const GUARD_FIRST = /\s*const rejection = rejectCrossSiteRequest\(request\)\s+if \(rejection\) return rejection\b/y

const routeFiles = readdirSync(API_DIR, { recursive: true })
  .filter(path => /(^|[\\/])route\.tsx?$/.test(path))

function startsWithGuard({ source, handlerIndex }) {
  BODY_START.lastIndex = handlerIndex
  const bodyStart = BODY_START.exec(source)
  if (!bodyStart) return false
  GUARD_FIRST.lastIndex = bodyStart.index + bodyStart[0].length
  return GUARD_FIRST.test(source)
}

test('every mutating route handler starts with the cross-site guard', () => {
  assert.ok(routeFiles.length > 10, `routes trouvées : ${routeFiles.length}`)

  for (const path of routeFiles) {
    const source = readFileSync(join(API_DIR, path), 'utf8')
    for (const handler of source.matchAll(MUTATING_HANDLER)) {
      assert.ok(startsWithGuard({ source, handlerIndex: handler.index }), `${path} : ${handler[1]} ne commence pas par rejectCrossSiteRequest`)
    }
  }
})
