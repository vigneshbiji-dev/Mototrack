import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isValidEmail, validateEmail } from '../utils/validateEmail.js'

describe('validateEmail', () => {
  it('accepts valid emails with domain extension', () => {
    assert.equal(isValidEmail('speed@gmail.com'), true)
    assert.equal(isValidEmail('user.name@example.co.in'), true)
  })

  it('rejects incomplete or invalid emails', () => {
    assert.equal(isValidEmail('speed@gmai'), false)
    assert.equal(isValidEmail('speed@gmail'), false)
    assert.equal(isValidEmail('notanemail'), false)
    assert.equal(isValidEmail('@gmail.com'), false)
  })

  it('returns normalized email when valid', () => {
    const result = validateEmail('  Speed@Gmail.COM  ')
    assert.equal(result.valid, true)
    assert.equal(result.email, 'speed@gmail.com')
  })
})
