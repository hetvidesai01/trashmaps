import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, Loader2, MapPin } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { ReportLifecycle } from '../common/ReportLifecycle'
import { MapView } from '../map/MapView'
import { LocationPicker } from '../map/LocationPicker'
import { ImageUploader } from './ImageUploader'
import { submitReport } from '../../services/api'
import { MUMBAI_CENTER } from '../../constants/map'
import { WASTE_CATEGORIES } from '../../constants/report'
import type { CitizenReport, ReportSeverity } from '../../types'

const SEVERITY_OPTIONS: { value: ReportSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

interface FormErrors {
  address?: string
  category?: string
  description?: string
}

export function ReportWasteForm() {
  const [address, setAddress] = useState('')
  const [category, setCategory] = useState('')
  const [severity, setSeverity] = useState<ReportSeverity>('medium')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [position, setPosition] = useState<[number, number]>(MUMBAI_CENTER)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedReport, setSubmittedReport] = useState<CitizenReport | null>(null)
  // Bumped on reset to remount the image uploader and map (both hold their
  // own uncontrolled/imperative state that plain prop resets wouldn't clear).
  const [formKey, setFormKey] = useState(0)

  function resetForm() {
    setAddress('')
    setCategory('')
    setSeverity('medium')
    setDescription('')
    setImageUrl(null)
    setPosition(MUMBAI_CENTER)
    setErrors({})
    setSubmittedReport(null)
    setFormKey((key) => key + 1)
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {}
    if (!address.trim()) nextErrors.address = 'Enter a location or address.'
    if (!category) nextErrors.category = 'Choose a waste category.'
    if (description.trim().length < 10) {
      nextErrors.description = 'Add a few more details (at least 10 characters).'
    }
    return nextErrors
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    const report = await submitReport({
      address: address.trim(),
      latitude: position[0],
      longitude: position[1],
      category,
      severity,
      description: description.trim(),
      imageUrl,
    })
    setIsSubmitting(false)
    setSubmittedReport(report)
  }

  if (submittedReport) {
    return (
      <Card className="p-8 text-center">
        <CircleCheck className="mx-auto text-primary" size={36} strokeWidth={1.5} />
        <p className="mt-3 font-display text-lg font-semibold text-ink">Report submitted successfully</p>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Your report will be reviewed before it can be added to a collection route.
        </p>

        <div className="mx-auto mt-6 max-w-xs">
          <ReportLifecycle status={submittedReport.status} />
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/my-reports">
            <Button variant="secondary">View my reports</Button>
          </Link>
          <Button onClick={resetForm}>Report another point</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form key={formKey} className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="address" className="text-sm font-medium text-ink">
            Location or address
          </label>
          <input
            id="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="e.g. Behind Bandra Bus Depot"
            className="mt-1.5 w-full rounded-lg border border-ink/10 bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
          />
          {errors.address && <p className="mt-1.5 text-xs text-[#D97706]">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="category" className="text-sm font-medium text-ink">
            Waste category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/10 bg-bg px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
          >
            <option value="">Select a category</option>
            {WASTE_CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1.5 text-xs text-[#D97706]">{errors.category}</p>}
        </div>

        <div>
          <span className="text-sm font-medium text-ink">Severity</span>
          <div className="mt-1.5 flex gap-2">
            {SEVERITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSeverity(option.value)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  severity === option.value
                    ? 'border-primary bg-primary text-white'
                    : 'border-ink/10 bg-bg text-muted hover:border-primary/40 hover:text-ink'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-ink">
            What did you find?
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Describe the waste and how long it&rsquo;s been there"
            className="mt-1.5 w-full resize-none rounded-lg border border-ink/10 bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
          />
          {errors.description && <p className="mt-1.5 text-xs text-[#D97706]">{errors.description}</p>}
        </div>

        <div>
          <span className="text-sm font-medium text-ink">Photo</span>
          <ImageUploader onImageChange={setImageUrl} />
        </div>

        <div>
          <span className="flex items-center gap-1.5 text-sm font-medium text-ink">
            <MapPin size={14} />
            Pinpoint the location
          </span>
          <p className="mt-1 text-xs text-muted">Tap the map to place the marker where the waste is.</p>
          <div className="mt-1.5 h-48 overflow-hidden rounded-lg border border-ink/10">
            <MapView center={position} zoom={14}>
              <LocationPicker position={position} onChange={setPosition} />
            </MapView>
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </p>
        </div>

        <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Submitting&hellip;
            </>
          ) : (
            'Submit report'
          )}
        </Button>
      </form>
    </Card>
  )
}
