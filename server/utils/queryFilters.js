export const applyDateRange = (filter, from, to, field = 'date') => {
  if (!from && !to) return filter
  filter[field] = filter[field] || {}
  if (from) filter[field].$gte = new Date(from)
  if (to) {
    const end = new Date(to)
    end.setHours(23, 59, 59, 999)
    filter[field].$lte = end
  }
  return filter
}

export const applyTextSearch = (filter, search, fields) => {
  if (!search?.trim()) return filter
  const regex = new RegExp(search.trim(), 'i')
  filter.$or = fields.map((field) => ({ [field]: regex }))
  return filter
}
