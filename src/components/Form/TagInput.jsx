import { useState } from 'react'
import { Tag } from '../Tag/Tag'
import Field from './Field'

/**
 * Type a value and press Enter (or comma) to add it as a chip.
 * Good for skills, target companies, target roles.
 *
 * <TagInput label="Skills" value={skills} onChange={setSkills} placeholder="e.g. Python" />
 *
 * `value` is an array of strings; `onChange` receives the new array.
 * Pass `suggestions` (array of strings) to show an autocomplete list.
 */
export default function TagInput({
  label,
  hint,
  error,
  required,
  className,
  value = [],
  onChange,
  placeholder,
  suggestions = [],
  variant = 'skill',
}) {
  const [draft, setDraft] = useState('')

  const add = (raw) => {
    const item = raw.trim()
    if (!item) return
    if (!value.some((v) => v.toLowerCase() === item.toLowerCase())) onChange?.([...value, item])
    setDraft('')
  }
  const remove = (item) => onChange?.(value.filter((v) => v !== item))

  return (
    <Field
      label={label}
      hint={hint ?? 'Press Enter to add'}
      error={error}
      required={required}
      className={className}
    >
      {(fieldProps) => (
        <div className="tag-input">
          {value.length > 0 && (
            <ul className="tag-list" aria-label={`Selected ${label}`}>
              {value.map((item) => (
                <li key={item}>
                  <Tag variant={variant} onRemove={() => remove(item)}>
                    {item}
                  </Tag>
                </li>
              ))}
            </ul>
          )}
          <input
            className="input"
            {...fieldProps}
            required={required && value.length === 0}
            list={suggestions.length ? `${fieldProps.id}-list` : undefined}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                add(draft)
              } else if (e.key === 'Backspace' && !draft && value.length) {
                remove(value[value.length - 1])
              }
            }}
            onBlur={() => add(draft)}
          />
          {suggestions.length > 0 && (
            <datalist id={`${fieldProps.id}-list`}>
              {suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </div>
      )}
    </Field>
  )
}
