import mongoose from 'mongoose'

const bikeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Other'],
      default: 'Petrol',
    },
    engineCapacity: {
      type: Number,
      default: null,
    },
    currentOdometer: {
      type: Number,
      default: 0,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
)

const Bike = mongoose.model('Bike', bikeSchema)
export default Bike
