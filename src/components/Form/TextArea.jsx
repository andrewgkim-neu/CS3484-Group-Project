import Field from './Field'

/** <TextArea label="Bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} /> */
export default function TextArea({
  label,
  hint,
  error,
  required,
  hideLabel,
  className,
  rows = 4,
  ...props
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
      {(fieldProps) => (
        <textarea className="input textarea" rows={rows} {...fieldProps} {...props} />
      )}
    </Field>
  )
}
