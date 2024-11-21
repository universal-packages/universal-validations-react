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

  it('shows errors en decided and keep calculating the validation on changes', async (): Promise<void> => {
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
  })
})
