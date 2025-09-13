import React from 'react'

type Props = {
  label: string
  placeholder?: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: 'text' | 'number'
  required?: boolean
  min?: number
  max?: number
}

export default function LabeledInput({ label, placeholder, value, onChange, type = 'text', required, min, max }: Props) {
  return (
    <label className="field">
      <div className="field-label">{label}</div>
      <input
        className="field-input"
        type={type}
        placeholder={placeholder}
        value={value as any}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
      />
    </label>
  )
}


