import fs from 'fs/promises'
import path from 'path'

export const deleteBikeImageFile = async (imageUrl) => {
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) return
  const filePath = path.join(process.cwd(), imageUrl)
  try {
    await fs.unlink(filePath)
  } catch {
    // file may already be gone
  }
}
