import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true,
    },
    type: {
      type: String,
      enum: ['Service', 'Insurance', 'PUC', 'Custom'],
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    dueOdometer: {
      type: Number,
      default: null,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

const Reminder = mongoose.model('Reminder', reminderSchema)
export default Reminder
