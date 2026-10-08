import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Camera, X } from 'lucide-react'
import { createBike, getBikeById, updateBike } from '../services/bikeService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function AddBike() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    fuelType: 'Petrol',
    engineCapacity: '',
    currentOdometer: '',
  })

  useEffect(() => {
    if (!id) return
    getBikeById(id)
      .then((bike) => {
        setForm({
          brand: bike.brand,
          model: bike.model,
          year: bike.year,
          registrationNumber: bike.registrationNumber || '',
          fuelType: bike.fuelType || 'Petrol',
          engineCapacity: bike.engineCapacity ? String(bike.engineCapacity) : '',
          currentOdometer: bike.currentOdometer ? String(bike.currentOdometer) : '',
        })
        if (bike.imageUrl) setExistingImageUrl(bike.imageUrl)
      })
      .catch(() => setError('Failed to load bike'))
      .finally(() => setFetching(false))
  }, [id])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'year' ? Number(value) : value,
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a JPEG, PNG, or WebP image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB')
      return
    }

    setError('')
    setRemoveImage(false)
    setImageFile(file)
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const clearImage = () => {
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    if (existingImageUrl) setRemoveImage(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const displayImage = imagePreview || (!removeImage ? existingImageUrl : null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      ...form,
      year: Number(form.year),
      engineCapacity: form.engineCapacity ? Number(form.engineCapacity) : undefined,
      currentOdometer: form.currentOdometer ? Number(form.currentOdometer) : 0,
    }
    const imageOptions = {
      image: imageFile,
      removeImage: removeImage && !imageFile,
    }
    try {
      if (isEdit && id) {
        await updateBike(id, payload, imageOptions)
      } else {
        await createBike(payload, { image: imageFile })
      }
      navigate('/garage')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <p className="text-text-muted">Loading bike...</p>
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isEdit ? 'Edit Motorcycle' : 'Add Motorcycle'}
        </h1>
        <p className="mt-1 text-text-muted">
          {isEdit ? 'Update your bike details' : 'Register a new bike in your garage'}
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Bike Photo</label>
            <div className="relative overflow-hidden rounded-xl border border-border bg-bg">
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-primary/10 to-bg">
                {displayImage ? (
                  <img src={displayImage} alt="Bike preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center text-text-muted">
                    <Camera size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No photo added</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 border-t border-border p-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-text transition-colors hover:border-accent hover:text-accent"
                >
                  {displayImage ? 'Change Photo' : 'Upload Photo'}
                </button>
                {displayImage && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="rounded-lg border border-border px-3 py-2 text-sm text-text-muted transition-colors hover:border-red-400 hover:text-red-400"
                    aria-label="Remove photo"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <p className="mt-2 text-xs text-text-subtle">JPEG, PNG, or WebP · Max 5 MB</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Brand *</label>
              <input name="brand" value={form.brand} onChange={handleChange} required className={inputClass} placeholder="Triumph" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Model *</label>
              <input name="model" value={form.model} onChange={handleChange} required className={inputClass} placeholder="Speed 400" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Year *</label>
              <input name="year" type="number" value={form.year} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Fuel Type</label>
              <select name="fuelType" value={form.fuelType} onChange={handleChange} className={inputClass}>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Engine CC</label>
              <input name="engineCapacity" value={form.engineCapacity} onChange={handleChange} className={inputClass} placeholder="398" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Current Odometer (km)</label>
              <input
                name="currentOdometer"
                type="number"
                min={0}
                value={form.currentOdometer}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Registration Number</label>
            <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} className={inputClass} placeholder="KL-XX-XXXX" />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Bike'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/garage')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
