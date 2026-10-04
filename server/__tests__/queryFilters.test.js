import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { applyDateRange, applyTextSearch } from '../utils/queryFilters.js'

describe('queryFilters', () => {
  it('applyDateRange adds gte and lte', () => {
    const filter = {}
    applyDateRange(filter, '2026-01-01', '2026-01-31')
    assert.ok(filter.date.$gte)
    assert.ok(filter.date.$lte)
  })

  it('applyTextSearch adds regex or conditions', () => {
    const filter = {}
    applyTextSearch(filter, 'triumph', ['brand', 'model'])
    assert.equal(filter.$or.length, 2)
  })
})
