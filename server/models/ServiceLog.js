import mongoose from 'mongoose'

const serviceLogSchema = new mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true,
    },
    serviceType: {
      type: String,
      enum: [
        'Periodic Service',
        'Oil Change',
        'Chain Service',
        'Brake Service',
        'Tyre Replacement',
        'Battery',
        'Electrical',
        'Engine',
        'Other Repair',
      ],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    odometer: { type: Number, min: 0, default: null },
    description: { type: String, trim: true, default: '' },
    partsCost: { type: Number, default: 0, min: 0 },
    labourCost: { type: Number, default: 0, min: 0 },
    totalCost: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
)

const ServiceLog = mongoose.model('ServiceLog', serviceLogSchema)
export default ServiceLog
