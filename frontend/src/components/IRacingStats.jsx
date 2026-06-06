import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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
    padding: '1.5rem',
    background: '#111c2e',
    borderRadius: 12,
    border: '1px solid #1e3154',
    color: '#e2e8f0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '1.5rem',
    borderBottom: '1px solid #1e3154',
    paddingBottom: '1rem',
  },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0' },
  subtitle: { fontSize: '0.8rem', color: '#64748b' },
  tabs: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' },
  tab: (active) => ({
    padding: '0.35rem 0.75rem',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    background: active ? '#1d4ed8' : '#1a2a42',
    color: active ? '#e2e8f0' : '#94a3b8',
    transition: 'background 0.15s',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '0.75rem',
  },
  card: {
    background: '#1a2a42',
    borderRadius: 8,
    padding: '0.9rem 1rem',
    border: '1px solid #1e3154',
  },
  statLabel: { fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' },
  statValue: { fontSize: '1.4rem', fontWeight: 700, color: '#e2e8f0', lineHeight: 1 },
  statSub: { fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.2rem' },
  irating: { fontSize: '1.4rem', fontWeight: 700, color: '#60a5fa', lineHeight: 1 },
  error: { color: '#f87171', textAlign: 'center', padding: '2rem' },
  loading: { color: '#64748b', textAlign: 'center', padding: '2rem' },
  chartWrapper: { marginTop: '1.5rem' },
  chartTitle: { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' },
  tooltip: { background: '#1a2a42', border: '1px solid #1e3154', borderRadius: 6, padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#e2e8f0' },
}

function IRatingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { when, value } = payload[0].payload
  return (
    <div style={s.tooltip}>
      <div style={{ color: '#9ca3af', marginBottom: 2 }}>{when}</div>
      <div style={{ color: '#60a5fa', fontWeight: 700 }}>{value.toLocaleString()} iR</div>
    </div>
  )
}

function IRatingChart({ chartData }) {
  if (!chartData?.data?.length) return null

  const formatted = chartData.data.map((d) => ({ when: d.when, value: d.value }))
  const values = formatted.map((d) => d.value)
  const minY = Math.floor(Math.min(...values) / 100) * 100
  const maxY = Math.ceil(Math.max(...values) / 100) * 100

  const tickCount = formatted.length
  const step = tickCount > 40 ? Math.ceil(tickCount / 8) : tickCount > 20 ? Math.ceil(tickCount / 6) : 1
  const xTicks = formatted.filter((_, i) => i % step === 0 || i === formatted.length - 1).map((d) => d.when)

  return (
    <div style={s.chartWrapper}>
      <div style={s.chartTitle}>iRating History</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={formatted} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e3154" vertical={false} />
          <XAxis
            dataKey="when"
            ticks={xTicks}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.slice(0, 7)}
          />
          <YAxis
            domain={[minY, maxY]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<IRatingTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#60a5fa', stroke: '#111c2e', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
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
    <>
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
      <IRatingChart chartData={data.iRating_chart} />
    </>
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
