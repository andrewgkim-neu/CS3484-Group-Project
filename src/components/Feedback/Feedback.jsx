import './Feedback.css'

/** <Spinner label="Loading alumni…" /> */
export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="spinner" role="status">
      <span className="spinner__circle" aria-hidden="true" />
      <span className="spinner__label">{label}</span>
    </div>
  )
}

/** <EmptyState title="No messages yet" action={<Button to="/search">Find alumni</Button>} /> */
export function EmptyState({ title, children, action }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      {children && <p className="text-muted">{children}</p>}
      {action}
    </div>
  )
}

/** Shows an API error. <ErrorMessage error={error} onRetry={reload} /> */
export function ErrorMessage({ error, onRetry }) {
  if (!error) return null
  return (
    <div className="error-message" role="alert">
      <p>{error.message ?? String(error)}</p>
      {onRetry && (
        <button type="button" className="error-message__retry" onClick={() => onRetry()}>
          Try again
        </button>
      )}
    </div>
  )
}
