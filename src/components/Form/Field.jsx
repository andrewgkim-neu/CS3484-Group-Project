import { useId } from 'react'
import './Form.css'

/**
 * Wraps any input with a label, hint, and error message, wired up for
 * screen readers. The child is a render function that receives the props
 * to spread onto the input:
 *
 * <Field label="Company" hint="Where you work now" error={errors.company}>
 *   {(props) => <input {...props} value={company} onChange={...} />}
 * </Field>
 *
 * Most of the time, use TextField / TextArea / Select instead, which use this.
 */
export default function Field({
  label,
  hint,
  error,
  required,
  hideLabel,
  className = '',
  children,
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`.trim()}>
      <label htmlFor={id} className={hideLabel ? 'visually-hidden' : 'field__label'}>
        {label}
        {required && (
          <span className="field__required" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {children({
        id,
        required,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      {error && (
        <p id={errorId} className="field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
