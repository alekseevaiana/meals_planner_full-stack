import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import App from './App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'

test('switch between pages', async () => {
  render(<App />, { wrapper: BrowserRouter })
  const user = userEvent.setup()

  let title = screen.getByTestId('title')
  expect(title.textContent).toBe('Meals')

  await user.click(screen.getByText(/Grocery/i))

  title = screen.getByTestId('title')
  expect(title.textContent).toBe('Grocery')

  await user.click(screen.getByText(/Plan/i))

  title = screen.getByTestId('title')
  expect(title.textContent).toBe('Plan')
})
