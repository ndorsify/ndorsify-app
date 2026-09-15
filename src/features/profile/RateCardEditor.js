import { Toggle } from '../../components/common/ds'
import { PLATFORM_OPTIONS, TYPE_OPTIONS, summarizeItems } from './helpers'

// The server rejects more than 10 packages, or more than 10 items in a
// package, with an opaque 422. Cap client-side so the limit shows as a
// disabled control instead of a bare error after the round trip.
const MAX_PACKAGES = 10
const MAX_ITEMS_PER_PACKAGE = 10

let nextKey = 0
const localKey = () => `pkg-${(nextKey += 1)}`

let nextItemKey = 0
const localItemKey = () => `item-${(nextItemKey += 1)}`

export const newItem = () => ({
  key: localItemKey(),
  platform: 'instagram',
  type: 'post',
  quantity: 1
})

export const newPackage = () => ({
  key: localKey(),
  name: 'New package',
  price: '',
  description: '',
  turnaround_days: 7,
  visible: true,
  items: [newItem()]
})

/**
 * The rate-card section of the profile editor. Controlled: `packages` and the
 * edits it reports are owned by ProfileEditPage, which also does the saving —
 * this component holds no rate-card state and calls no API.
 */
export default function RateCardEditor({ packages, onChange, errors = [] }) {
  const errorFor = (index) =>
    (errors.find((e) => e.index === index) || {}).message

  const update = (index, patch) =>
    onChange(packages.map((p, i) => (i === index ? { ...p, ...patch } : p)))

  const updateItem = (pkgIndex, itemIndex, patch) =>
    update(pkgIndex, {
      items: packages[pkgIndex].items.map((item, i) =>
        i === itemIndex ? { ...item, ...patch } : item
      )
    })

  return (
    <>
      <div className="nd-h1" style={{ fontSize: '1.25rem' }}>
        Rate card
      </div>

      {packages.length === 0 && (
        <p className="nd-muted" style={{ fontSize: '0.72rem' }}>
          No packages yet. Add one so brands can see what you charge — the
          cheapest visible package becomes your listed rate in Discover.
        </p>
      )}

      {packages.map((pk, i) => (
        <div className="pe__pkg" data-testid="rate-package" key={pk.key}>
          <div className="nd-row" style={{ gap: 12 }}>
            <input
              aria-label="Package name"
              className="pe__pkg-name"
              onChange={(e) => update(i, { name: e.target.value })}
              value={pk.name}
            />
            <input
              aria-label="Price in dollars"
              className="pe__pkg-price"
              inputMode="numeric"
              onChange={(e) => update(i, { price: e.target.value })}
              placeholder="$"
              value={pk.price}
            />
            <button
              className="nd-btn nd-btn--sm"
              onClick={() => onChange(packages.filter((_, idx) => idx !== i))}
              type="button"
            >
              Remove package
            </button>
          </div>

          <input
            aria-label="What's included"
            className="nd-input"
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="What's included"
            value={pk.description}
          />

          <div className="nd-stack" style={{ gap: 8 }}>
            {pk.items.map((item, j) => (
              <div
                className="nd-row"
                data-testid="rate-item"
                key={item.key}
                style={{ gap: 8 }}
              >
                <select
                  aria-label="Item platform"
                  className="nd-input"
                  onChange={(e) =>
                    updateItem(i, j, { platform: e.target.value })
                  }
                  value={item.platform}
                >
                  {PLATFORM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Item type"
                  className="nd-input"
                  onChange={(e) => updateItem(i, j, { type: e.target.value })}
                  value={item.type}
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  aria-label="Item quantity"
                  className="nd-input"
                  inputMode="numeric"
                  onChange={(e) =>
                    updateItem(i, j, { quantity: e.target.value })
                  }
                  style={{ maxWidth: 72 }}
                  value={item.quantity}
                />
                <button
                  className="nd-btn nd-btn--sm"
                  onClick={() =>
                    update(i, {
                      items: pk.items.filter((_, idx) => idx !== j)
                    })
                  }
                  type="button"
                >
                  Remove item
                </button>
              </div>
            ))}
            {pk.items.length < MAX_ITEMS_PER_PACKAGE && (
              <button
                className="nd-add"
                onClick={() => update(i, { items: [...pk.items, newItem()] })}
                type="button"
              >
                + Add item
              </button>
            )}
          </div>

          <div className="pe__pkg-inc">{summarizeItems(pk.items) || '—'}</div>

          <div className="nd-between">
            <label className="nd-row" style={{ gap: 8 }}>
              <span className="nd-mono nd-muted" style={{ fontSize: '0.7rem' }}>
                Turnaround
              </span>
              <input
                aria-label="Turnaround in days"
                className="nd-input"
                inputMode="numeric"
                onChange={(e) => update(i, { turnaround_days: e.target.value })}
                style={{ maxWidth: 72 }}
                value={pk.turnaround_days}
              />
              <span className="nd-mono nd-muted" style={{ fontSize: '0.7rem' }}>
                days
              </span>
            </label>
            <div className="nd-row" style={{ gap: 9 }}>
              <Toggle
                on={pk.visible}
                onClick={() => update(i, { visible: !pk.visible })}
              />
              <span className="nd-ink2" style={{ fontSize: '0.75rem' }}>
                Visible to brands
              </span>
            </div>
          </div>

          {errorFor(i) && <p className="nd-error">{errorFor(i)}</p>}
        </div>
      ))}

      {packages.length < MAX_PACKAGES && (
        <button
          className="nd-add"
          onClick={() => onChange([...packages, newPackage()])}
          type="button"
        >
          + Add package
        </button>
      )}
    </>
  )
}
