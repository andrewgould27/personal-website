import { render, screen } from '@testing-library/react'
import App from './App'

global.fetch = vi.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
)

test('renders name heading', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: /andrew gould/i })).toBeInTheDocument()
})
