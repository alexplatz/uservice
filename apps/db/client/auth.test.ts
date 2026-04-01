import { Database } from 'bun:sqlite'
import { describe, expect, it } from 'bun:test'

describe('testing', () => {
  it('works', () => {
    expect(1).toBe(1)
  })
})

describe('database', () => {
  it('works', () => {
    const db = new Database('test.sqlite')
    expect(typeof db).toBe('object')
  })
})
