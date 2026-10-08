import MaintenanceSchedule from '../models/MaintenanceSchedule.js'
import { MAINTENANCE_SCHEDULE_SEED } from '../data/maintenanceSchedules.seed.js'

export const seedMaintenanceSchedules = async () => {
  for (const entry of MAINTENANCE_SCHEDULE_SEED) {
    await MaintenanceSchedule.findOneAndUpdate(
      { manufacturer: entry.manufacturer, model: entry.model, market: entry.market || 'India' },
      { $set: entry },
      { upsert: true, new: true }
    )
  }
}
