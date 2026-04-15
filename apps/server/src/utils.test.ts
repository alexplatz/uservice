import { describe, expect, it } from 'bun:test'
import { generateMagicToken, generateMagicTokenRecord } from './utils'

describe('generateMagicToken', () => {
  it('returns a hex encoded, 512 character string', () => {
    const magicToken = generateMagicToken()

    expect(magicToken.length).toBe(512)
  })
})

describe('generateMagicTokenRecord', () => {
  it('returns a magicToken with date metrics', async () => {
    const magicToken = generateMagicToken()
    const magicTokenRecord = await generateMagicTokenRecord(magicToken)

    expect(magicTokenRecord.tokenHash === magicToken).toBeFalse()
    expect(magicTokenRecord.createdAt).toBeDate()
    expect(
      magicTokenRecord.expiresAt.getTime() > magicTokenRecord.createdAt.getTime()
    ).toBeTrue()
  })
})
