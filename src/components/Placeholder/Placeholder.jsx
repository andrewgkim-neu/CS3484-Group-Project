import Card from '../Card/Card'
import PageHeader from '../PageHeader/PageHeader'

/**
 * Temporary stand-in for a page that hasn't been built yet.
 * Delete it from your page once you start building.
 */
export default function Placeholder({ title, owner, todo = [], children }) {
  return (
    <>
      <PageHeader title={title} subtitle={`Placeholder · owned by ${owner}`} />
      <Card className="stack">
        {todo.length > 0 && (
          <div className="stack-sm">
            <h2 style={{ fontSize: 'var(--text-lg)' }}>To build</h2>
            <ul>
              {todo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {children}
      </Card>
    </>
  )
}
