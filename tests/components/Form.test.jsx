import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { Select, TagInput, TextField } from '../../src/components'

describe('TextField', () => {
  it('is reachable by its label', () => {
    render(<TextField label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement)
  })

  it('announces errors to screen readers', () => {
    render(<TextField label="Email" error="Must be a Northeastern email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription(/Must be a Northeastern email/)
    expect(screen.getByRole('alert')).toHaveTextContent('Must be a Northeastern email')
  })

  it('links the hint text to the input', () => {
    render(<TextField label="Email" hint="Use your school address" />)
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Use your school address')
  })
})

describe('Select', () => {
  it('accepts plain strings or {value, label} options', () => {
    render(
      <>
        <Select label="Major" options={['Biology', 'Physics']} />
        <Select label="Status" options={[{ value: 'open', label: 'Open' }]} />
      </>,
    )
    expect(screen.getByRole('option', { name: 'Physics' })).toHaveValue('Physics')
    expect(screen.getByRole('option', { name: 'Open' })).toHaveValue('open')
  })
})

describe('TagInput', () => {
  function Harness({ initial = [] }) {
    const [skills, setSkills] = useState(initial)
    return <TagInput label="Skills" value={skills} onChange={setSkills} />
  }

  it('adds a tag when you press Enter', async () => {
    render(<Harness />)
    await userEvent.type(screen.getByLabelText('Skills'), 'Python{Enter}')
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByLabelText('Skills')).toHaveValue('')
  })

  it('ignores duplicates regardless of case', async () => {
    render(<Harness initial={['Python']} />)
    await userEvent.type(screen.getByLabelText('Skills'), 'python{Enter}')
    expect(screen.getAllByText(/python/i)).toHaveLength(1)
  })

  it('removes a tag with its × button', async () => {
    render(<Harness initial={['Python', 'SQL']} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove Python' }))
    expect(screen.queryByText('Python')).not.toBeInTheDocument()
    expect(screen.getByText('SQL')).toBeInTheDocument()
  })
})
