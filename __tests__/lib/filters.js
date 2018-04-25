import {byTags, byText} from '../../lib/filters'

describe('byTags', () => {
  test('return false if items do not contain all the tags', () => {
    const tags = ['foo', 'bar', 'toto']
    const tagsToContain = ['foo', 'tata']
    expect(byTags(tags, tagsToContain)).toBe(false)
  })

  test('return true if items contain all the tags', () => {
    const tags = ['foo', 'bar', 'toto']
    const tagsToContain = ['foo', 'toto']
    expect(byTags(tags, tagsToContain)).toBe(true)
  })

  test('return true if no tags to contain', () => {
    const tags = ['foo', 'bar', 'toto']
    const tagsToContain = []
    expect(byTags(tags, tagsToContain)).toBe(true)
  })
})

describe('byText', () => {
  test('return true if the text to find is in text with accent', () => {
    const text = 'Déjà vu'
    const toFind = 'deja vu'
    expect(byText(text, toFind)).toBe(true)
  })

  test('return true if the text to find is in text with uppercase', () => {
    const text = 'hello world'
    const toFind = 'HELLO'
    expect(byText(text, toFind)).toBe(true)
  })
})
