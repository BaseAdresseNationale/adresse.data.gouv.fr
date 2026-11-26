import assert from 'node:assert/strict'
import test from 'node:test'
import { loadTsModule } from '../test-utils/load-ts-module.mjs'

const { getSirenFromIdentity } = loadTsModule({ url: new URL('./district-ownership.ts', import.meta.url) })

test('the SIREN that gates commune settings is the first 9 digits of the agent SIRET, or nothing', () => {
  assert.equal(getSirenFromIdentity({ sub: 'agent-sub', siret: '21600627000019' }), '216006270')
  for (const identity of [null, { sub: 'agent-sub' }, { sub: 'agent-sub', siret: '21600627' }, { sub: 'agent-sub', siret: '' }]) {
    assert.equal(getSirenFromIdentity(identity), null, JSON.stringify(identity))
  }
})
