import {unionTypes} from '../../lib/types'

describe('unionTypes', () => {
  test('return array of unique key', () => {
    const arrays = [['ban', 'bano'], ['ban', 'cadastre'], ['ban']]
    const toFind = ['ban', 'bano', 'cadastre']
    expect(unionTypes(arrays)).toEqual(toFind)
  })
})
