import { useState } from 'react'
import { Camera, CircleCheck } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export function ReportWasteForm() {
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <CircleCheck className="text-primary" size={36} strokeWidth={1.5} />
        <p className="font-display text-lg font-semibold text-ink">Report submitted for review</p>
        <p className="max-w-sm text-sm text-muted">
          A verified report is added to the waste map so it can be picked up on the next route
          pass. This screen is a placeholder &mdash; submissions aren&rsquo;t stored yet.
        </p>
        <Button variant="secondary" onClick={() => setSubmitted(false)}>
          Report another point
        </Button>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <div>
          <label htmlFor="address" className="text-sm font-medium text-ink">
            Location or address
          </label>
          <input
            id="address"
            required
            placeholder="e.g. Behind Baner Bus Depot"
            className="mt-1.5 w-full rounded-lg border border-ink/10 bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-ink">
            What did you find?
          </label>
          <textarea
            id="description"
            required
            rows={4}
            placeholder="Describe the waste and how long it&rsquo;s been there"
            className="mt-1.5 w-full resize-none rounded-lg border border-ink/10 bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <span className="text-sm font-medium text-ink">Photo</span>
          <button
            type="button"
            className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/15 py-8 text-sm text-muted transition-colors hover:border-primary/40 hover:text-primary-dark"
          >
            <Camera size={17} />
            Add a photo
          </button>
        </div>

        <Button type="submit" className="w-full justify-center">
          Submit report
        </Button>
      </form>
    </Card>
  )
}
