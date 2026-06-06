import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import IRacingStats from './IRacingStats'

const MOCK_STATS = {
  member_since: '2016-10-17',
  road: {
    iRating: { value: 2627, when: '2024-01-21' },
    starts: 307,
    wins: 19,
    top5: 109,
    poles: 22,
    avg_start_position: 8,
    avg_finish_position: 9,
    laps: 6670,
    laps_led: 397,
    avg_incidents: 5.25,
    avg_points: 55,
    win_percentage: 6.19,
    top5_percentage: 35.5,
    laps_led_percentage: 5.95,
  },
  oval: {
    iRating: { value: 1646, when: '2021-05-15' },
    starts: 45,
    wins: 1,
    top5: 9,
    poles: 1,
    avg_start_position: 11,
    avg_finish_position: 11,
    laps: 1407,
    laps_led: 43,
    avg_incidents: 4.07,
    avg_points: 53,
    win_percentage: 2.22,
    top5_percentage: 20,
    laps_led_percentage: 3.06,
  },
  // discipline with 0 starts should not appear as a tab
  formula_car: {
    iRating: { value: 2584, when: '2025-10-26' },
    starts: 0,
    wins: 0,
    top5: 0,
    poles: 0,
    avg_start_position: 0,
    avg_finish_position: 0,
    laps: 0,
    laps_led: 0,
    avg_incidents: 0,
    win_percentage: 0,
    top5_percentage: 0,
    laps_led_percentage: 0,
  },
}

function mockFetchSuccess() {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(MOCK_STATS) })
  )
}

function mockFetchError(status = 500) {
  global.fetch = vi.fn(() =>
    Promise.resolve({ ok: false, status })
  )
}

afterEach(() => {
  vi.restoreAllMocks()
})

test('shows loading state before data arrives', () => {
  global.fetch = vi.fn(() => new Promise(() => {})) // never resolves
  render(<IRacingStats />)
  expect(screen.getByText(/loading iracing stats/i)).toBeInTheDocument()
})

test('renders stats after fetch resolves', async () => {
  mockFetchSuccess()
  render(<IRacingStats />)

  await waitFor(() => expect(screen.getByText('iRacing Career Stats')).toBeInTheDocument())
  expect(screen.getByText('Member since 2016')).toBeInTheDocument()
})

test('fetches from the correct API endpoint', async () => {
  mockFetchSuccess()
  render(<IRacingStats />)

  await waitFor(() => screen.getByText('iRacing Career Stats'))
  expect(fetch).toHaveBeenCalledWith('/api/iracing/stats')
})

test('defaults to Road tab and shows road stats', async () => {
  mockFetchSuccess()
  render(<IRacingStats />)

  await waitFor(() => screen.getByText('Road'))

  expect(screen.getByText('2,627')).toBeInTheDocument() // iRating
  expect(screen.getByText('307')).toBeInTheDocument()   // starts
  expect(screen.getByText('19')).toBeInTheDocument()    // wins
})

test('only shows tabs for disciplines with starts', async () => {
  mockFetchSuccess()
  render(<IRacingStats />)

  await waitFor(() => screen.getByText('Road'))

  expect(screen.getByRole('button', { name: 'Road' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Oval' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Formula Car' })).not.toBeInTheDocument()
})

test('switching tabs shows the correct discipline stats', async () => {
  mockFetchSuccess()
  const user = userEvent.setup()
  render(<IRacingStats />)

  await waitFor(() => screen.getByRole('button', { name: 'Oval' }))
  await user.click(screen.getByRole('button', { name: 'Oval' }))

  expect(screen.getByText('1,646')).toBeInTheDocument() // oval iRating
  expect(screen.getByText('45')).toBeInTheDocument()    // oval starts
})

test('shows error message when fetch fails', async () => {
  mockFetchError(500)
  render(<IRacingStats />)

  await waitFor(() => screen.getByText(/failed to load stats/i))
  expect(screen.getByText(/HTTP 500/)).toBeInTheDocument()
})
