import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bike',
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Accessories',
        'Parts',
        'Tyres',
        'Insurance',
        'Cleaning',
        'Modification',
        'Repair',
        'Other',
      ],
      required: true,
    },
    storeName: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Other'],
      default: 'Cash',
    },
    notes: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
)

const Expense = mongoose.model('Expense', expenseSchema)
export default Expense
