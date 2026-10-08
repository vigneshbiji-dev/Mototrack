import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { getScheduleIntervals } from '../services/maintenanceMatchService.js'

describe('maintenance schedules', () => {
  it('reads Triumph flat interval', () => {
    const intervals = getScheduleIntervals({
      verified: true,
      serviceIntervalKm: 16000,
      serviceIntervalMonths: 12,
    })
    assert.equal(intervals.recurring.km, 16000)
    assert.equal(intervals.recurring.months, 12)
  })

  it('reads Bajaj first + recurring interval', () => {
    const intervals = getScheduleIntervals({
      verified: true,
      firstService: { km: 500, months: 1 },
      recurringService: { km: 5000, months: 4 },
    })
    assert.equal(intervals.first.km, 500)
    assert.equal(intervals.recurring.km, 5000)
  })

  it('returns null for unverified catalog entry', () => {
    assert.equal(getScheduleIntervals({ verified: false }), null)
  })
})
