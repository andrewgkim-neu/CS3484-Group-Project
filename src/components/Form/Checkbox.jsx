import { useId } from 'react'
import './Form.css'

/** <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> */
export default function Checkbox({ label, className = '', ...props }) {
  const id = useId()
  return (
    <div className={`checkbox ${className}`.trim()}>
      <input id={id} type="checkbox" {...props} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}
