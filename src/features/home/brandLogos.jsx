// Logos for the "trusted by" strip. These are the product's own demo brands —
// drawn here as real marks instead of the hatched placeholder boxes they used
// to be. Monochrome via currentColor so the strip reads as one set.
//
// Wordmarks use the page font (Plus Jakarta Sans, loaded in index.html) rather
// than outlined letterforms, so they stay crisp and editable.

const wordmark = (children, word, width = 118) => (
  <svg
    viewBox={`0 0 ${width} 28`}
    height="26"
    role="img"
    aria-label={word}
    fill="none"
  >
    {children}
    <text
      x="32"
      y="19"
      fontSize="13.5"
      fontWeight="700"
      letterSpacing="-0.3"
      fill="currentColor"
    >
      {word}
    </text>
  </svg>
)

// Fern: two mirrored fronds.
const KettleAndFern = () =>
  wordmark(
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 22C14 13 17 8 22 5" />
      <path d="M14 22C14 13 11 8 6 5" />
      <path d="M14 22v-6" />
    </g>,
    'Kettle & Fern',
    148
  )

// Aurelia: a ring with a gap, like a rising sun.
const Aurelia = () =>
  wordmark(
    <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M5 18a9 9 0 0 1 18 0" />
      <path d="M9.5 22h9" />
    </g>,
    'Aurelia'
  )

// Northwind: a chevron pair pointing north.
const Northwind = () =>
  wordmark(
    <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 15l8-8 8 8" />
      <path d="M6 22l8-8 8 8" />
    </g>,
    'Northwind',
    132
  )

// Bloom: four petals.
const Bloom = () =>
  wordmark(
    <g fill="currentColor">
      <circle cx="14" cy="8" r="4.2" />
      <circle cx="14" cy="20" r="4.2" />
      <circle cx="8" cy="14" r="4.2" />
      <circle cx="20" cy="14" r="4.2" />
    </g>,
    'Bloom',
    104
  )

// Poms: three stacked pom-poms.
const Poms = () =>
  wordmark(
    <g fill="currentColor">
      <circle cx="10" cy="9" r="4" />
      <circle cx="19" cy="13" r="4" />
      <circle cx="12" cy="19" r="4" />
    </g>,
    'Poms',
    96
  )

// Verá: a V with the accent as a dot.
const Vera = () =>
  wordmark(
    <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8l8 13 8-13" />
      <circle cx="22" cy="5" r="1.8" fill="currentColor" stroke="none" />
    </g>,
    'Verá',
    96
  )

export const brandLogos = [
  { name: 'Kettle & Fern', Logo: KettleAndFern },
  { name: 'Aurelia', Logo: Aurelia },
  { name: 'Northwind', Logo: Northwind },
  { name: 'Bloom', Logo: Bloom },
  { name: 'Poms', Logo: Poms },
  { name: 'Verá', Logo: Vera }
]
