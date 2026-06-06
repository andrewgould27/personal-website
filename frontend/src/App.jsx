import Hero from './components/Hero'
import IRacingStats from './components/IRacingStats'

export default function App() {
  return (
    <main style={{ maxWidth: 760, margin: '4rem auto', padding: '0 1.5rem' }}>
      <Hero />
      <IRacingStats />
    </main>
  )
}
