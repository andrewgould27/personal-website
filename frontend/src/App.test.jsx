import { render, screen } from '@testing-library/react'
import App from './App'

test('renders name heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /andrew gould/i })).toBeInTheDocument()
})
