import './Card.css'

/**
 * White box with a border and padding. Use as the base for any panel.
 * <Card>...</Card>
 * <Card as="article" padding="lg">...</Card>
 */
export default function Card({
  as: Tag = 'div',
  padding = 'md',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`card card--pad-${padding} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
