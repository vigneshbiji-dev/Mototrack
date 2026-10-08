import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import bikeRoutes from './routes/bikeRoutes.js'
import fuelRoutes from './routes/fuelRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import reminderRoutes from './routes/reminderRoutes.js'
import maintenanceRoutes from './routes/maintenanceRoutes.js'
import errorHandler from './middleware/errorMiddleware.js'
import { seedMaintenanceSchedules } from './config/seedMaintenance.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
  res.json({ message: 'M2T API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/bikes', bikeRoutes)
app.use('/api/fuel', fuelRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/reminders', reminderRoutes)
app.use('/api/maintenance', maintenanceRoutes)

app.use(errorHandler)

connectDB().then(async () => {
  await seedMaintenanceSchedules()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})
