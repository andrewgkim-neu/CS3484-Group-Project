import Field from './Field'

/**
 * File picker (e.g. resume upload). Files aren't really uploaded anywhere;
 * store the file name in your data instead.
 *
 * <FileInput label="Resume" accept=".pdf,.doc,.docx"
 *            fileName={resume?.fileName}
 *            onFileSelect={(file) => setResume({ fileName: file.name, uploadedAt: new Date().toISOString() })} />
 */
export default function FileInput({
  label,
  hint,
  error,
  required,
  className,
  fileName,
  onFileSelect,
  accept,
  ...props
}) {
  return (
    <Field label={label} hint={hint} error={error} required={required} className={className}>
      {(fieldProps) => (
        <div className="file-input">
          <input
            type="file"
            accept={accept}
            className="file-input__native"
            {...fieldProps}
            {...props}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFileSelect?.(file)
            }}
          />
          {fileName && <p className="file-input__current text-sm">Current file: {fileName}</p>}
        </div>
      )}
    </Field>
  )
}
