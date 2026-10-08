import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { uploadBikeImage } from '../middleware/uploadMiddleware.js'
import {
  createBike,
  getBikes,
  getBikeById,
  getBikeSummary,
  updateBike,
  deleteBike,
} from '../controllers/bikeController.js'

const router = express.Router()

router.use(protect)

router.route('/').post(uploadBikeImage.single('image'), createBike).get(getBikes)
router.get('/:id/summary', getBikeSummary)
router.route('/:id').get(getBikeById).put(uploadBikeImage.single('image'), updateBike).delete(deleteBike)

export default router
