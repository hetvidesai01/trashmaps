import { useRef, useState, type ChangeEvent } from 'react'
import { Camera, X } from 'lucide-react'

interface ImageUploaderProps {
  onImageChange: (previewUrl: string | null) => void
}

/**
 * Lets a citizen attach a photo to their report. This is a frontend
 * prototype: the file is never uploaded anywhere — it's only kept as a
 * local, in-browser object URL for preview, ready to be swapped for a real
 * upload call once a backend exists.
 */
export function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, etc).')
      return
    }

    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    onImageChange(url)
  }

  function handleRemove() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    onImageChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        id="report-image"
      />

      {previewUrl ? (
        <div className="tm-pop relative overflow-hidden rounded-2xl border border-line">
          <img src={previewUrl} alt="Selected waste photo preview" className="h-44 w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove photo"
            className="absolute right-1.5 top-1.5 flex h-11 w-11 items-center justify-center rounded-full bg-ink/70 text-white transition-colors hover:bg-ink"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="report-image"
          className="tm-press flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-sage-soft/50 py-8 text-sm font-bold text-muted hover:border-primary/40 hover:text-primary-dark focus-within:border-primary"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary shadow-card">
            <Camera size={20} />
          </span>
          Add a photo
        </label>
      )}

      {error && <p className="mt-1.5 text-xs font-semibold text-[#b9731d]">{error}</p>}
    </div>
  )
}
