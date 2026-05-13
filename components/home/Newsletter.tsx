'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-obsidian py-24 px-8">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-body text-xs uppercase tracking-widest text-stone mb-4">
          Stay Connected
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-ivory mb-4">
          Join Urja Jewels
        </h2>
        <p className="font-body text-fog text-sm mb-10">
          Receive invitations to private previews and new collection announcements.
        </p>

        {submitted ? (
          <p className="font-body text-gold text-base" role="status">
            Thank you. You will hear from us soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="your@email.com"
                className="w-full bg-transparent border border-fog/40 text-ivory font-body text-sm px-4 py-3 placeholder:text-stone focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
                aria-describedby={error ? 'newsletter-error' : undefined}
                aria-invalid={!!error}
              />
              {error && (
                <p id="newsletter-error" className="mt-2 text-left font-body text-xs text-gold" role="alert">
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" variant="primary" size="md">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
