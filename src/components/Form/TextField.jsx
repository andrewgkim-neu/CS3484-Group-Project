import Field from './Field'

/**
 * Labeled text input. All extra props go to the <input>.
 *
 * <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
 *            error={errors.email} hint="Use your @northeastern.edu address" required />
 */
export default function TextField({
  label,
  hint,
  error,
  required,
  hideLabel,
  className,
  ...inputProps
}) {
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={className}
    >
      {(fieldProps) => <input className="input" type="text" {...fieldProps} {...inputProps} />}
    </Field>
  )
}
