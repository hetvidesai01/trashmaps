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
        className="hidden"
        id="report-image"
      />

      {previewUrl ? (
        <div className="relative mt-1.5 overflow-hidden rounded-lg border border-ink/10">
          <img src={previewUrl} alt="Selected waste photo preview" className="h-40 w-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove photo"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-ink"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          htmlFor="report-image"
          className="mt-1.5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-ink/15 py-8 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary-dark"
        >
          <Camera size={17} />
          Add a photo
        </label>
      )}

      {error && <p className="mt-1.5 text-xs text-[#D97706]">{error}</p>}
    </div>
  )
}
