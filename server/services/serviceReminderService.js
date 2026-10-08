import ServiceLog from '../models/ServiceLog.js'
import { findScheduleForBike, getScheduleIntervals } from './maintenanceMatchService.js'

const DUE_SOON_KM = 1000
const DUE_SOON_DAYS = 30

const addMonths = (date, months) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

const daysBetween = (from, to) => {
  const ms = to.getTime() - from.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

const nextKmFromInterval = (currentOdometer, intervalKm, lastServiceOdometer) => {
  if (!intervalKm) return null
  if (lastServiceOdometer != null) return lastServiceOdometer + intervalKm
  if (currentOdometer <= 0) return intervalKm
  return Math.ceil(currentOdometer / intervalKm) * intervalKm
}

const pickApplicableInterval = (intervals, lastService, serviceCount) => {
  if (intervals.first && (!lastService || serviceCount === 0)) {
    return { label: 'First service', km: intervals.first.km, months: intervals.first.months }
  }
  return {
    label: 'Periodic service',
    km: intervals.recurring.km,
    months: intervals.recurring.months,
  }
}

export const calculateSmartServiceReminder = async (bike) => {
  const schedule = await findScheduleForBike(bike.brand, bike.model)
  const intervals = schedule ? getScheduleIntervals(schedule) : null

  const lastService = await ServiceLog.findOne({ bike: bike._id })
    .sort({ date: -1, odometer: -1 })

  const serviceCount = await ServiceLog.countDocuments({ bike: bike._id })

  if (!schedule || !intervals?.recurring) {
    return {
      bikeId: bike._id,
      brand: bike.brand,
      model: bike.model,
      currentOdometer: bike.currentOdometer,
      scheduleFound: Boolean(schedule),
      verified: schedule?.verified ?? false,
      status: 'no_schedule',
      message: schedule
        ? 'Manufacturer schedule not yet verified for this model.'
        : 'No manufacturer schedule in M2T catalog yet.',
      schedule: schedule
        ? {
            manufacturer: schedule.manufacturer,
            model: schedule.model,
            verified: schedule.verified,
            source: schedule.source,
            sourceUrl: schedule.sourceUrl,
          }
        : null,
      lastService: lastService
        ? { date: lastService.date, odometer: lastService.odometer, serviceType: lastService.serviceType }
        : null,
    }
  }

  const applicable = pickApplicableInterval(intervals, lastService, serviceCount)
  const baseDate = lastService?.date || bike.createdAt || new Date()
  const baseOdometer = lastService?.odometer ?? null

  const nextKm = nextKmFromInterval(bike.currentOdometer, applicable.km, baseOdometer)
  const nextDate = applicable.months ? addMonths(baseDate, applicable.months) : null

  const now = new Date()
  const kmRemaining = nextKm != null ? nextKm - bike.currentOdometer : null
  const daysRemaining = nextDate ? daysBetween(now, nextDate) : null

  const kmOverdue = kmRemaining != null && kmRemaining < 0
  const dateOverdue = daysRemaining != null && daysRemaining < 0

  let status = 'upcoming'
  if (kmOverdue || dateOverdue) status = 'overdue'
  else if (
    (kmRemaining != null && kmRemaining <= DUE_SOON_KM) ||
    (daysRemaining != null && daysRemaining <= DUE_SOON_DAYS)
  ) {
    status = 'due_soon'
  } else if (lastService) {
    status = 'up_to_date'
  }

  return {
    bikeId: bike._id,
    brand: bike.brand,
    model: bike.model,
    currentOdometer: bike.currentOdometer,
    scheduleFound: true,
    verified: true,
    status,
    serviceLabel: applicable.label,
    recommendedKm: nextKm,
    recommendedDate: nextDate,
    kmRemaining,
    daysRemaining,
    kmOverdueBy: kmOverdue ? Math.abs(kmRemaining) : null,
    intervalLabel: `${applicable.km?.toLocaleString('en-IN') || '—'} km / ${applicable.months || '—'} months`,
    schedule: {
      manufacturer: schedule.manufacturer,
      model: schedule.model,
      verified: schedule.verified,
      source: schedule.source,
      sourceUrl: schedule.sourceUrl,
      notes: schedule.notes,
      serviceIntervalKm: applicable.km,
      serviceIntervalMonths: applicable.months,
    },
    lastService: lastService
      ? { date: lastService.date, odometer: lastService.odometer, serviceType: lastService.serviceType }
      : null,
  }
}

export const getSmartRemindersForUser = async (bikes) => {
  const results = await Promise.all(bikes.map((bike) => calculateSmartServiceReminder(bike)))

  const grouped = {
    overdue: results.filter((r) => r.status === 'overdue'),
    due_soon: results.filter((r) => r.status === 'due_soon'),
    upcoming: results.filter((r) => r.status === 'upcoming'),
    up_to_date: results.filter((r) => r.status === 'up_to_date'),
    no_schedule: results.filter((r) => r.status === 'no_schedule'),
  }

  return { items: results, grouped }
}
