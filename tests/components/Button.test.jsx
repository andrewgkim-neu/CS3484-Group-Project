import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../../src/components'
import { renderWithRouter } from '../helpers/renderApp'

describe('Button', () => {
  it('renders a button that calls onClick', async () => {
    const onClick = vi.fn()
    renderWithRouter(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('defaults to type="button" so it never submits a form by accident', () => {
    renderWithRouter(<Button>Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('is disabled and marked busy while loading', async () => {
    const onClick = vi.fn()
    renderWithRouter(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Saving' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders an in-app link when given `to`', () => {
    renderWithRouter(<Button to="/search">Find alumni</Button>)
    expect(screen.getByRole('link', { name: 'Find alumni' })).toHaveAttribute('href', '/search')
  })

  it('opens external links in a new tab safely', () => {
    renderWithRouter(<Button href="https://linkedin.com">LinkedIn</Button>)
    const link = screen.getByRole('link', { name: 'LinkedIn' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})
