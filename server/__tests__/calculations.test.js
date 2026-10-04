import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateDistance,
  calculateMileage,
  calculateTotalFuelCost,
  calculateCostPerKm,
} from '../utils/calculations.js'

describe('calculations', () => {
  it('calculateDistance returns positive difference', () => {
    assert.equal(calculateDistance(5100, 5000), 100)
    assert.equal(calculateDistance(5000, 5000), null)
    assert.equal(calculateDistance(5000, null), null)
  })

  it('calculateMileage validates plausible range', () => {
    assert.equal(calculateMileage(100, 2), 50)
    assert.equal(calculateMileage(4000, 2), null)
    assert.equal(calculateMileage(100, 0), null)
  })

  it('calculateTotalFuelCost multiplies price and quantity', () => {
    assert.equal(calculateTotalFuelCost(116, 2), 232)
  })

  it('calculateCostPerKm divides cost by distance', () => {
    assert.equal(calculateCostPerKm(232, 100), 2.32)
    assert.equal(calculateCostPerKm(232, 0), null)
  })
})
