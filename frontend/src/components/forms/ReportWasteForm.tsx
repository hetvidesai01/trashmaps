import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, Loader2, MapPin } from 'lucide-react'
import { Button } from '../common/Button'
import { MapView } from '../map/MapView'
import { LocationPicker } from '../map/LocationPicker'
import { ImageUploader } from './ImageUploader'
import { submitReport } from '../../services/api'
import { MUMBAI_CENTER } from '../../constants/map'
import { WASTE_CATEGORIES } from '../../constants/report'
import type { ReportSeverity } from '../../types'

// Severity isn't asked of citizens — it has no effect on routing. The API
// contract still carries it, so submit the neutral default.
const DEFAULT_SEVERITY: ReportSeverity = 'medium'

interface FormErrors {
  address?: string
  category?: string
}

export function ReportWasteForm() {
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [position, setPosition] = useState<[number, number]>(MUMBAI_CENTER)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // Bumped on reset to remount the image uploader and map (both hold their
  // own uncontrolled/imperative state that plain prop resets wouldn't clear).
  const [formKey, setFormKey] = useState(0)

  function resetForm() {
    setAddress('')
    setCategory('')
    setDescription('')
    setImageUrl(null)
    setPosition(MUMBAI_CENTER)
    setErrors({})
    setIsSubmitted(false)
    setFormKey((key) => key + 1)
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!address.trim()) nextErrors.address = 'Where is the waste?'
    if (!category) nextErrors.category = 'Choose a waste type.'
    return nextErrors
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    await submitReport({
      address: address.trim(),
      latitude: position[0],
      longitude: position[1],
      category,
      severity: DEFAULT_SEVERITY,
      description: description.trim(),
      imageUrl,
    })
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="py-8 text-center">
        <CircleCheck className="mx-auto text-primary" size={40} strokeWidth={1.5} />
        <p className="mt-4 font-display text-2xl font-semibold text-ink">Report submitted</p>
        <p className="mx-auto mt-2 max-w-sm text-base text-muted">
          Your report will be reviewed before being added to a collection route.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/my-reports">
            <Button>View My Reports</Button>
          </Link>
          <Button variant="secondary" onClick={resetForm}>
            Report Another
          </Button>
        </div>
      </div>
    )
  }

  const inputClasses =
    'mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none'

  return (
    <form key={formKey} className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="address" className="text-sm font-medium text-ink">
          Location
        </label>
        <input
          id="address"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="e.g. Behind Bandra Bus Depot"
          className={inputClasses}
        />
        {errors.address && <p className="mt-1.5 text-xs text-[#D97706]">{errors.address}</p>}
        <div className="mt-2 h-44 overflow-hidden rounded-lg border border-ink/10">
          <MapView center={position} zoom={14}>
            <LocationPicker position={position} onChange={setPosition} />
          </MapView>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={12} />
          Tap the map to mark the exact spot.
        </p>
      </div>

      <div>
        <span className="text-sm font-medium text-ink">Photo</span>
        <ImageUploader onImageChange={setImageUrl} />
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-medium text-ink">
          Waste Type
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={inputClasses}
        >
          <option value="">Select a type</option>
          {WASTE_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1.5 text-xs text-[#D97706]">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Description <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className={`${inputClasses} resize-none`}
        />
      </div>

      <Button type="submit" className="w-full justify-center py-3.5 text-base" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 size={17} className="animate-spin" />
            Submitting&hellip;
          </>
        ) : (
          'Report Waste'
        )}
      </Button>
    </form>
  )
}
