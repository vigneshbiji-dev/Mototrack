import MaintenanceSchedule from '../models/MaintenanceSchedule.js'

export const normalizeName = (value = '') =>
  value.toLowerCase().replace(/[^a-z0-9]/g, '')

export const getScheduleIntervals = (schedule) => {
  if (!schedule?.verified) return null

  if (schedule.recurringService?.km || schedule.recurringService?.months) {
    return {
      first: schedule.firstService?.km || schedule.firstService?.months ? schedule.firstService : null,
      recurring: schedule.recurringService,
    }
  }

  if (schedule.serviceIntervalKm || schedule.serviceIntervalMonths) {
    return {
      first: schedule.firstService?.km || schedule.firstService?.months ? schedule.firstService : null,
      recurring: {
        km: schedule.serviceIntervalKm,
        months: schedule.serviceIntervalMonths,
      },
    }
  }

  return null
}

export const findScheduleForBike = async (brand, model, market = 'India') => {
  const schedules = await MaintenanceSchedule.find({ active: true, market })
  const brandKey = normalizeName(brand)
  const modelKey = normalizeName(model)

  return (
    schedules.find(
      (s) => normalizeName(s.manufacturer) === brandKey && normalizeName(s.model) === modelKey
    ) || null
  )
}
