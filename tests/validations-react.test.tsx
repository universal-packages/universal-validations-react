import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import TestApp from './TestApp'

describe('validation-react', (): void => {
  it('validates when everything is in place', async (): Promise<void> => {
    render(<TestApp />)

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'David' } })
    })

    expect(screen.queryByTestId('changed')).toHaveTextContent('{"name":"David"}')

    await waitFor(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(screen.queryByTestId('success')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()
  })

  it('shows errors and keep calculating the validation on changes', async (): Promise<void> => {
    render(<TestApp />)

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'robert' } })
    })

    expect(screen.queryByTestId('changed')).toHaveTextContent('{"name":"robert"}')

    await waitFor(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsDavid validation"]}')

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'David' } })
    })

    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'omar' } })
    })

    expect(screen.queryByTestId('changed')).toHaveTextContent('{}')

    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'any' } })
    })

    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsDavid validation"]}')

    await waitFor(async () => {
      fireEvent.click(screen.getByText('Extra errors'))
    })

    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsDavid validation"],"other":["Extra errors"]}')
  })

  it('allows to reset the validation', async (): Promise<void> => {
    render(<TestApp />)

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'robert' } })
    })

    expect(screen.queryByTestId('changed')).toHaveTextContent('{"name":"robert"}')

    await waitFor(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsDavid validation"]}')

    await waitFor(async () => {
      fireEvent.click(screen.getByText('Reset'))
    })

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()
  })

  it('show extra errors when fields match', async (): Promise<void> => {
    render(<TestApp />)

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'David' } })
    })

    await waitFor(async () => {
      fireEvent.click(screen.getByText('Extra errors'))
    })

    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"other":["Extra errors"]}')

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: '' } })
    })

    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsDavid validation"]}')

    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'David' } })
    })

    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"other":["Extra errors"]}')
  })

  it('validates using the specified schema', async (): Promise<void> => {
    render(<TestApp />)

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()
    expect(screen.queryByTestId('schema')).not.toBeInTheDocument()

    // Change to a valid name for default validation
    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'David' } })
    })

    // Should pass default validation
    await waitFor(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(screen.queryByTestId('success')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).not.toBeInTheDocument()

    // Reset
    await waitFor(async () => {
      fireEvent.click(screen.getByText('Reset'))
    })

    // Switch to admin schema
    await waitFor(async () => {
      fireEvent.click(screen.getByText('Use Admin Schema'))
    })

    expect(screen.queryByTestId('schema')).toBeInTheDocument()
    expect(screen.queryByTestId('schema')).toHaveTextContent('Using schema: "admin"')

    // Enter a name that passes default validation but fails admin validation
    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'David' } })
    })

    // Should fail admin validation
    await waitFor(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    expect(screen.queryByTestId('success')).not.toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toBeInTheDocument()
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsAdmin validation"]}')

    // Now enter a name that passes admin validation
    await waitFor(async () => {
      fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'Admin' } })
    })

    // Should pass admin validation
    await waitFor(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })

    // Admin passes but default fails
    expect(screen.queryByTestId('errors')).toHaveTextContent('Errors: {"name":["name failed nameIsDavid validation"]}')
  })
})
