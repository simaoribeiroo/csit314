import React from 'react'

type Option = { value: string; label: string }

type Props = {
  id: string
  label: string
  as?: 'input' | 'textarea' | 'select'
  type?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<any>) => void
  placeholder?: string
  required?: boolean
  rows?: number
  options?: Option[]
  className?: string
  children?: React.ReactNode
}

export default function FormField({
  id,
  label,
  as = 'input',
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  options = [],
  className = '',
  children,
}: Props) {
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={id}>{label}</label>

      {children ? (
        children
      ) : as === 'textarea' ? (
        <textarea id={id} placeholder={placeholder} value={value as string | undefined} onChange={onChange} rows={rows} required={required} />
      ) : as === 'select' ? (
        <select id={id} value={value as string | undefined} onChange={onChange} required={required}>
          <option value="" disabled>
            {placeholder ?? 'Select'}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input id={id} type={type} placeholder={placeholder} value={value as string | number | undefined} onChange={onChange} required={required} />
      )}
    </div>
  )
}
