import Bike from '../models/Bike.js'

export const verifyBikeOwnership = async (bikeId, userId) => {
  const bike = await Bike.findOne({ _id: bikeId, owner: userId })
  if (!bike) return null
  return bike
}

export const getUserBikeIds = async (userId) => {
  const bikes = await Bike.find({ owner: userId }).select('_id')
  return bikes.map((b) => b._id)
}
