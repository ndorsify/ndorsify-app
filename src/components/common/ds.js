// Small presentational building blocks for the Ndorsify design system.
// Styling lives in src/styles/ndorsify.css.

export function Avatar({ label, size = 40, square = false, src, style }) {
  return (
    <span
      className={square ? 'nd-avatar nd-avatar--sq' : 'nd-avatar'}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(9, size * 0.28),
        ...style
      }}
    >
      {src ? <img src={src} alt={label} /> : label}
    </span>
  )
}

export function Kpi({ label, value, delta, note, trend = 'up' }) {
  const trendClass =
    trend === 'down'
      ? 'nd-delta--down'
      : trend === 'flat'
      ? 'nd-delta--flat'
      : 'nd-delta--up'
  return (
    <div className="nd-kpi">
      <div className="nd-kpi__label">{label}</div>
      <div className="nd-kpi__value">{value}</div>
      <div className="nd-kpi__foot">
        {delta && <span className={`nd-delta ${trendClass}`}>{delta}</span>}
        {note && (
          <span className="nd-muted" style={{ fontSize: '0.72rem' }}>
            {note}
          </span>
        )}
      </div>
    </div>
  )
}

export function Meter({ value, style }) {
  const pct = typeof value === 'number' ? `${value}%` : value
  return (
    <div className="nd-meter" style={style}>
      <div className="nd-meter__fill" style={{ width: pct }} />
    </div>
  )
}

export function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      className={on ? 'nd-toggle is-on' : 'nd-toggle'}
      aria-pressed={on}
      onClick={onClick}
    >
      <span className="nd-toggle__knob" />
    </button>
  )
}

export function ChartPlaceholder({ label, height = 132 }) {
  return (
    <div className="nd-chart-ph" style={{ height }}>
      {label}
    </div>
  )
}

// Shown when a screen is rendering representative sample data because no live
// backend rows were returned.
export function SampleBanner({
  children = 'Showing sample data — connect the backend to see live records.'
}) {
  return (
    <div
      className="nd-sample-note"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderRadius: 999,
        background: 'var(--canvas)',
        border: '1px solid var(--line)'
      }}
    >
      <span className="nd-dot" style={{ background: 'var(--warn)' }} />
      {children}
    </div>
  )
}
