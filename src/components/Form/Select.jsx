import Field from './Field'

/**
 * Labeled dropdown. `options` can be strings or { value, label } objects.
 *
 * <Select label="Major" options={MAJORS} value={major} onChange={(e) => setMajor(e.target.value)}
 *         placeholder="Choose a major" />
 */
export default function Select({
  label,
  hint,
  error,
  required,
  hideLabel,
  className,
  options = [],
  placeholder,
  ...props
}) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={className}
    >
      {(fieldProps) => (
        <select className="input select" {...fieldProps} {...props}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {normalized.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  )
}
