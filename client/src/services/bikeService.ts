import api from './api'

export interface BikeInput {
  brand: string
  model: string
  year: number
  registrationNumber?: string
  fuelType?: string
  engineCapacity?: number
  currentOdometer?: number
  imageUrl?: string
}

export interface BikeSaveOptions {
  image?: File | null
  removeImage?: boolean
}

const buildFormData = (bike: Partial<BikeInput>, options: BikeSaveOptions = {}) => {
  const formData = new FormData()
  Object.entries(bike).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value))
    }
  })
  if (options.image) formData.append('image', options.image)
  if (options.removeImage) formData.append('removeImage', 'true')
  return formData
}

export const getBikes = async () => {
  const { data } = await api.get('/bikes')
  return data
}

export const createBike = async (bike: BikeInput, options: BikeSaveOptions = {}) => {
  if (options.image) {
    const { data } = await api.post('/bikes', buildFormData(bike, options))
    return data
  }
  const { data } = await api.post('/bikes', bike)
  return data
}

export const getBikeById = async (id: string) => {
  const { data } = await api.get(`/bikes/${id}`)
  return data
}

export const updateBike = async (id: string, bike: Partial<BikeInput>, options: BikeSaveOptions = {}) => {
  if (options.image || options.removeImage) {
    const { data } = await api.put(`/bikes/${id}`, buildFormData(bike, options))
    return data
  }
  const { data } = await api.put(`/bikes/${id}`, bike)
  return data
}

export const deleteBike = async (id: string) => {
  const { data } = await api.delete(`/bikes/${id}`)
  return data
}
