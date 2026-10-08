import mongoose from 'mongoose'

const intervalSchema = new mongoose.Schema(
  {
    km: { type: Number, min: 0 },
    months: { type: Number, min: 0 },
  },
  { _id: false }
)

const maintenanceScheduleSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    modelYear: { type: Number, default: null },
    market: { type: String, default: 'India', trim: true },
    verified: { type: Boolean, default: false },
    serviceIntervalKm: { type: Number, default: null, min: 0 },
    serviceIntervalMonths: { type: Number, default: null, min: 0 },
    firstService: { type: intervalSchema, default: null },
    recurringService: { type: intervalSchema, default: null },
    source: { type: String, trim: true, default: '' },
    sourceUrl: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

maintenanceScheduleSchema.index({ manufacturer: 1, model: 1, market: 1 })

const MaintenanceSchedule = mongoose.model('MaintenanceSchedule', maintenanceScheduleSchema)
export default MaintenanceSchedule
