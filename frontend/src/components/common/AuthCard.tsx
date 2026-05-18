import React from 'react'

type Props = {
  containerClass?: string
  cardClass?: string
  title: string
  onSubmit: (e: React.FormEvent) => void
  submitText: string
  isSubmitting?: boolean
  error?: string
  footer?: React.ReactNode
  children?: React.ReactNode
}

export default function AuthCard({
  containerClass = 'login-container',
  cardClass = 'login-card',
  title,
  onSubmit,
  submitText,
  isSubmitting,
  error,
  footer,
  children,
}: Props) {
  return (
    <div className={containerClass}>
      <div className={cardClass}>
        <h2 className="login-title">{title}</h2>

        <form onSubmit={onSubmit} className="login-form">
          {error ? <p className="login-error" role="alert">{error}</p> : null}
          {children}

          <button type="submit" className="login-button" disabled={!!isSubmitting}>
            {submitText}
          </button>
        </form>

        <div className="login-footer">
          {footer}
        </div>
      </div>
    </div>
  )
}
