import { useEffect, useState } from 'react'

const API_URL = '/api/iracing/stats'

const DISCIPLINES = [
  { key: 'road', label: 'Road' },
  { key: 'oval', label: 'Oval' },
  { key: 'sports_car', label: 'Sports Car' },
  { key: 'dirt_oval', label: 'Dirt Oval' },
  { key: 'dirt_road', label: 'Dirt Road' },
  { key: 'formula_car', label: 'Formula Car' },
]

const s = {
  widget: {
    fontFamily: 'sans-serif',
    maxWidth: 720,
    margin: '0 auto',
    padding: '1.5rem',
    background: '#0f1117',
    borderRadius: 12,
    color: '#e8eaf0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #1e2130',
    paddingBottom: '1rem',
  },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#fff' },
  subtitle: { fontSize: '0.8rem', color: '#6b7280' },
  tabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' },
  tab: (active) => ({
    padding: '0.35rem 0.75rem',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    background: active ? '#3b82f6' : '#1e2130',
    color: active ? '#fff' : '#9ca3af',
    transition: 'background 0.15s',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '0.75rem',
  },
  card: {
    background: '#1e2130',
    borderRadius: 8,
    padding: '0.9rem 1rem',
  },
  statLabel: { fontSize: '0.7rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' },
  statValue: { fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 },
  statSub: { fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.2rem' },
  irating: { fontSize: '1.4rem', fontWeight: 700, color: '#3b82f6', lineHeight: 1 },
  error: { color: '#ef4444', textAlign: 'center', padding: '2rem' },
  loading: { color: '#6b7280', textAlign: 'center', padding: '2rem' },
}

function StatCard({ label, value, sub }) {
  return (
    <div style={s.card}>
      <div style={s.statLabel}>{label}</div>
      <div style={s.statValue}>{value}</div>
      {sub && <div style={s.statSub}>{sub}</div>}
    </div>
  )
}

function DisciplineStats({ data }) {
  const winPct = data.win_percentage?.toFixed(1)
  const top5Pct = data.top5_percentage?.toFixed(1)
  const lapsLedPct = data.laps_led_percentage?.toFixed(1)

  return (
    <div style={s.grid}>
      <div style={s.card}>
        <div style={s.statLabel}>iRating</div>
        <div style={s.irating}>{data.iRating?.value?.toLocaleString() ?? '—'}</div>
        <div style={s.statSub}>as of {data.iRating?.when ?? '—'}</div>
      </div>
      <StatCard label="Starts" value={data.starts?.toLocaleString()} />
      <StatCard label="Wins" value={data.wins} sub={`${winPct}% win rate`} />
      <StatCard label="Top 5" value={data.top5} sub={`${top5Pct}% top 5 rate`} />
      <StatCard label="Poles" value={data.poles} />
      <StatCard label="Avg Start" value={data.avg_start_position} />
      <StatCard label="Avg Finish" value={data.avg_finish_position} />
      <StatCard label="Laps Led" value={data.laps_led?.toLocaleString()} sub={`${lapsLedPct}% of laps`} />
      <StatCard label="Total Laps" value={data.laps?.toLocaleString()} />
      <StatCard label="Avg Inc." value={data.avg_incidents?.toFixed(2)} />
    </div>
  )
}

export default function IRacingStats() {
  const [stats, setStats] = useState(null)
  const [active, setActive] = useState('road')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(API_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setStats)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div style={s.widget}><div style={s.error}>Failed to load stats: {error}</div></div>
  if (!stats) return <div style={s.widget}><div style={s.loading}>Loading iRacing stats…</div></div>

  const memberYear = stats.member_since?.slice(0, 4)
  const activeDisciplines = DISCIPLINES.filter((d) => stats[d.key]?.starts > 0)

  return (
    <div style={s.widget}>
      <div style={s.header}>
        <h2 style={s.title}>iRacing Career Stats</h2>
        <span style={s.subtitle}>Member since {memberYear}</span>
      </div>

      <div style={s.tabs}>
        {activeDisciplines.map((d) => (
          <button key={d.key} style={s.tab(active === d.key)} onClick={() => setActive(d.key)}>
            {d.label}
          </button>
        ))}
      </div>

      {stats[active] && <DisciplineStats data={stats[active]} />}
    </div>
  )
}
