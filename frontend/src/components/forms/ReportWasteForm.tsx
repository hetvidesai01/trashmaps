import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Boxes,
  Check,
  Ellipsis,
  HardHat,
  Loader2,
  LocateFixed,
  MapPin,
  Trash2,
  Wind,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { RecycleBin } from '../illustrations'
import { MapView } from '../map/MapView'
import { LocationPicker } from '../map/LocationPicker'
import { ImageUploader } from './ImageUploader'
import { inputClasses, labelClasses } from './fieldStyles'
import { submitReport } from '../../services/api'
import { MUMBAI_CENTER } from '../../constants/map'
import { WASTE_CATEGORIES } from '../../constants/report'
import type { ReportSeverity } from '../../types'

// Severity isn't asked of citizens — it has no effect on routing. The API
// contract still carries it, so submit the neutral default.
const DEFAULT_SEVERITY: ReportSeverity = 'medium'

const CATEGORY_ICONS: Record<(typeof WASTE_CATEGORIES)[number], LucideIcon> = {
  'Overflowing bin': Trash2,
  'Illegal dumping': Boxes,
  'Loose litter': Wind,
  'Construction debris': HardHat,
  Other: Ellipsis,
}

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
  const [isLocating, setIsLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
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
    setLocateError(null)
    setIsSubmitted(false)
    setFormKey((key) => key + 1)
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!address.trim()) nextErrors.address = 'Where is the waste?'
    if (!category) nextErrors.category = 'Choose a waste type.'
    return nextErrors
  }

  function handleUseCurrentLocation() {
    if (!('geolocation' in navigator)) {
      setLocateError('Location is not available on this device.')
      return
    }
    setIsLocating(true)
    setLocateError(null)
    navigator.geolocation.getCurrentPosition(
      (result) => {
        setPosition([result.coords.latitude, result.coords.longitude])
        setAddress((current) => current || 'My current location')
        setErrors((prev) => ({ ...prev, address: undefined }))
        setIsLocating(false)
      },
      () => {
        setLocateError('Could not get your location. Tap the map to mark the spot instead.')
        setIsLocating(false)
      },
      { timeout: 10000 },
    )
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
      <Card className="relative overflow-hidden px-6 pb-8 pt-10 text-center">
        <div className="relative mx-auto h-20 w-20">
          <span className="tm-ring absolute inset-0 rounded-full bg-primary/30" aria-hidden="true" />
          <span className="tm-pop relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white shadow-button">
            <Check size={40} strokeWidth={3} />
          </span>
        </div>
        <h2 className="tm-rise mt-5 text-2xl font-extrabold text-ink" style={{ animationDelay: '0.15s' }}>
          Report submitted!
        </h2>
        <p
          className="tm-rise mx-auto mt-2 max-w-xs text-sm font-semibold leading-relaxed text-muted"
          style={{ animationDelay: '0.22s' }}
        >
          Thank you for your contribution. Your report will be reviewed before being added to a collection route.
        </p>

        <div className="tm-rise mx-auto mt-4 w-40" style={{ animationDelay: '0.3s' }}>
          <RecycleBin sparkles />
        </div>

        <div className="mt-4 space-y-3">
          <Link to="/my-reports" className="block">
            <Button variant="soft" className="w-full py-4 text-base">
              View My Reports
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={resetForm}>
            Report Another
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} noValidate>
      <Card className="space-y-6 p-5 sm:p-6">
        <div>
          <span className={labelClasses}>Add a photo</span>
          <ImageUploader onImageChange={setImageUrl} />
        </div>

        <div>
          <label htmlFor="address" className={labelClasses}>
            Location
          </label>
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <MapPin size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="e.g. Behind Bandra Bus Depot"
                className={`${inputClasses} pl-10`}
                aria-invalid={Boolean(errors.address)}
              />
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              aria-label="Use current location"
              title="Use current location"
              className="tm-press flex w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-primary-dark hover:bg-sage-soft disabled:opacity-60"
            >
              {isLocating ? <Loader2 size={18} className="animate-spin" /> : <LocateFixed size={18} />}
            </button>
          </div>
          {errors.address && <p className="mt-1.5 text-xs font-semibold text-[#b9731d]">{errors.address}</p>}
          {locateError && <p className="mt-1.5 text-xs font-semibold text-[#b9731d]">{locateError}</p>}
          <div className="relative isolate mt-3 h-44 overflow-hidden rounded-2xl border border-line">
            <MapView center={position} zoom={14}>
              <LocationPicker position={position} onChange={setPosition} />
            </MapView>
          </div>
          <p className="mt-1.5 text-xs font-semibold text-muted">Tap the map to mark the exact spot.</p>
        </div>

        <fieldset>
          <legend className={labelClasses}>Waste type</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {WASTE_CATEGORIES.map((option) => {
              const Icon = CATEGORY_ICONS[option]
              const isSelected = category === option
              return (
                <label
                  key={option}
                  className={`tm-press flex min-h-[5.25rem] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border px-1.5 py-3 text-center text-[11px] font-bold leading-tight focus-within:ring-2 focus-within:ring-primary/30 ${
                    isSelected
                      ? 'border-primary bg-sage text-primary-dark'
                      : 'border-line bg-white text-muted hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option}
                    checked={isSelected}
                    onChange={() => setCategory(option)}
                    className="sr-only"
                  />
                  <Icon size={21} strokeWidth={1.9} />
                  {option}
                </label>
              )
            })}
          </div>
          {errors.category && <p className="mt-1.5 text-xs font-semibold text-[#b9731d]">{errors.category}</p>}
        </fieldset>

        <div>
          <label htmlFor="description" className={labelClasses}>
            Description <span className="font-medium">(optional)</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Add any details…"
            className={`${inputClasses} resize-none`}
          />
        </div>

        <Button type="submit" className="w-full py-4 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Submitting&hellip;
            </>
          ) : (
            <>
              Submit Report
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </Card>
    </form>
  )
}
