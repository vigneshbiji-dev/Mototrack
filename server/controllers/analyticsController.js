import { getDashboardAnalytics } from '../services/analyticsService.js'

export const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardAnalytics(req.user)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
