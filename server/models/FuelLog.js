import mongoose from 'mongoose'

const fuelLogSchema = new mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true,
    },
    fuelType: {
      type: String,
      default: 'Petrol',
    },
    date: {
      type: Date,
      required: [true, 'Fuel date is required'],
      default: Date.now,
    },
    fuelPrice: {
      type: Number,
      required: [true, 'Fuel price per litre is required'],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, 'Fuel quantity is required'],
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    fuelStation: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Other'],
      default: 'Cash',
    },
    cardName: { type: String, trim: true, default: '' },
    cardLast4: { type: String, trim: true, default: '' },
    odometer: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      min: 0,
    },
    meterMileage: { type: Number, default: null },
    calculatedMileage: { type: Number, default: null },
    drivingStyle: {
      type: String,
      enum: ['Casual', 'Mixed', 'Aggressive'],
      default: 'Mixed',
    },
  },
  { timestamps: true }
)

const FuelLog = mongoose.model('FuelLog', fuelLogSchema)
export default FuelLog
