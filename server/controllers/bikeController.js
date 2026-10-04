import Bike from '../models/Bike.js'
import { deleteBikeImageFile } from '../utils/imageFile.js'

const parseBikeBody = (body) => ({
  brand: body.brand,
  model: body.model,
  year: body.year ? Number(body.year) : undefined,
  registrationNumber: body.registrationNumber,
  fuelType: body.fuelType,
  engineCapacity: body.engineCapacity ? Number(body.engineCapacity) : undefined,
  currentOdometer: body.currentOdometer != null ? Number(body.currentOdometer) : undefined,
})

export const createBike = async (req, res) => {
  try {
    const { brand, model, year, registrationNumber, fuelType, engineCapacity, currentOdometer } =
      parseBikeBody(req.body)

    if (!brand || !model || !year) {
      return res.status(400).json({ message: 'Brand, model, and year are required' })
    }

    const imageUrl = req.file ? `/uploads/bikes/${req.file.filename}` : ''

    const bike = await Bike.create({
      owner: req.user,
      brand,
      model,
      year,
      registrationNumber,
      fuelType,
      engineCapacity,
      currentOdometer,
      imageUrl,
    })

    res.status(201).json(bike)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBikes = async (req, res) => {
  try {
    const bikes = await Bike.find({ owner: req.user }).sort({ createdAt: -1 })
    res.json(bikes)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.id, owner: req.user })
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' })
    }
    res.json(bike)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.id, owner: req.user })
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' })
    }

    const parsed = parseBikeBody(req.body)
    const fields = [
      'brand',
      'model',
      'year',
      'registrationNumber',
      'fuelType',
      'engineCapacity',
      'currentOdometer',
    ]
    fields.forEach((field) => {
      if (parsed[field] !== undefined) bike[field] = parsed[field]
    })

    if (req.body.removeImage === 'true' || req.body.removeImage === true) {
      await deleteBikeImageFile(bike.imageUrl)
      bike.imageUrl = ''
    }

    if (req.file) {
      await deleteBikeImageFile(bike.imageUrl)
      bike.imageUrl = `/uploads/bikes/${req.file.filename}`
    }

    const updated = await bike.save()
    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.id, owner: req.user })
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' })
    }

    await deleteBikeImageFile(bike.imageUrl)
    await bike.deleteOne()
    res.json({ message: 'Bike removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
