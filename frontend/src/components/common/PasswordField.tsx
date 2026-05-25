import React, { forwardRef, useState } from 'react'

type Props = {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
}

const PasswordField = forwardRef<HTMLInputElement, Props>(
  ({ id, value, onChange, placeholder = 'Password', required = false }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div className="password-input-wrapper">
        <input
          ref={ref}
          id={id}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? '✕' : '○'}
        </button>
      </div>
    )
  },
)

export default PasswordField
