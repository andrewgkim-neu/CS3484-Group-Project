import './PageHeader.css'

/**
 * Title at the top of every page. Puts the page's single <h1> in place.
 * <PageHeader title="Search alumni" subtitle="Find people by major, company, or role"
 *             actions={<Button>New post</Button>} />
 */
export default function PageHeader({ title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div>
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  )
}
