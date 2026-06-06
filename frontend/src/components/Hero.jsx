import { useEffect, useState } from 'react'

const PHRASES = [
  'a software engineer.',
  'a sim racer.',
  'building things.',
]

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [cursorOn, setCursorOn] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setCursorOn((v) => !v), 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const phrase = PHRASES[phraseIndex]

    if (!deleting && displayed.length < phrase.length) {
      const t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 65)
      return () => clearTimeout(t)
    }

    if (!deleting && displayed.length === phrase.length) {
      const t = setTimeout(() => setDeleting(true), 1800)
      return () => clearTimeout(t)
    }

    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35)
      return () => clearTimeout(t)
    }

    if (deleting && displayed.length === 0) {
      setDeleting(false)
      setPhraseIndex((i) => (i + 1) % PHRASES.length)
    }
  }, [displayed, deleting, phraseIndex])

  return (
    <div style={{ marginBottom: '3rem' }}>
      <p style={{ margin: '0 0 0.4rem', fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Hi there, I&apos;m
      </p>
      <h1 style={{ margin: '0 0 1rem', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 700, color: '#e2e8f0', lineHeight: 1.1 }}>
        Andrew Gould
      </h1>
      <p style={{ margin: 0, fontSize: 'clamp(1rem, 3vw, 1.25rem)', color: '#94a3b8', minHeight: '2em' }}>
        I&apos;m&nbsp;
        <span style={{ color: '#60a5fa', fontWeight: 600 }}>{displayed}</span>
        <span style={{
          display: 'inline-block',
          width: '2px',
          height: '1.1em',
          background: cursorOn ? '#60a5fa' : 'transparent',
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          borderRadius: '1px',
          transition: 'background 0.1s',
        }} />
      </p>
    </div>
  )
}
