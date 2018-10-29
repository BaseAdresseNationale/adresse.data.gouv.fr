import {unionTypes} from '../types'

describe('unionTypes', () => {
  test('return array of unique key', () => {
    const arrays = [['ban', 'bano'], ['ban', 'cadastre'], ['ban']]
    const toFind = ['ban', 'bano', 'cadastre']
    expect(unionTypes(arrays)).toEqual(toFind)
  })

  test('handle null key', () => {
    const arrays = [['ban', 'bano'], null, ['ban']]
    const toFind = ['ban', 'bano']
    expect(unionTypes(arrays)).toEqual(toFind)
  })
})
