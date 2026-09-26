/*
 * Representative sample data drawn from the Ndorsify Canvas design.
 * Screens prefer live API data; these fill in where the backend has no
 * matching endpoint yet (KPIs, analytics, earnings) or returns nothing,
 * so the redesign renders completely in demo/offline mode.
 */

/* ---- 1a landing ---------------------------------------------------------- */
export const heroMatches = [
  {
    initials: 'MO',
    name: 'Maya Okonkwo',
    niche: 'Skincare',
    followers: '184K',
    engagement: '6.4%'
  },
  {
    initials: 'DL',
    name: 'Dara Leigh',
    niche: 'Clean beauty',
    followers: '92K',
    engagement: '5.1%'
  },
  {
    initials: 'RN',
    name: 'Renu Nair',
    niche: 'Derm science',
    followers: '311K',
    engagement: '4.2%'
  }
]
export const landingStats = [
  { value: '12,480', label: 'Vetted creators across 9 platforms' },
  { value: '$0', label: 'Platform fee for creators' },
  { value: '9 days', label: 'Median brief-to-first-post' },
  { value: '96%', label: 'Campaigns fully delivered' }
]
export const landingFeatures = [
  {
    num: '01',
    title: 'Search real audience data',
    body: 'Filter 12k+ creators by verified reach, engagement, audience geo and niche — no guesswork, no inflated follower counts.'
  },
  {
    num: '02',
    title: 'Agree on rates in the open',
    body: 'Published rate cards and structured counter-offers. Both sides see the same numbers before anyone commits.'
  },
  {
    num: '03',
    title: 'Run brief to payout in one place',
    body: 'Briefs, approvals, deliverables and escrow-backed payments — the whole endorsement without the email chains.'
  }
]
export const footerCols = [
  {
    title: 'PRODUCT',
    links: ['For brands', 'For creators', 'Pricing', 'Case studies']
  },
  { title: 'COMPANY', links: ['About', 'Careers', 'Blog', 'Contact'] },
  {
    title: 'LEGAL',
    links: ['Privacy', 'Terms', 'Creator agreement', 'Cookies']
  }
]

/* ---- 1b discovery -------------------------------------------------------- */
export const filterGroups = [
  {
    title: 'PLATFORM',
    items: [
      { label: 'Instagram', count: '842', on: true },
      { label: 'TikTok', count: '531', on: true },
      { label: 'YouTube', count: '288', on: false },
      { label: 'X', count: '120', on: false }
    ]
  },
  {
    title: 'AUDIENCE SIZE',
    items: [
      { label: 'Nano · <10K', count: '210', on: false },
      { label: 'Micro · 10–100K', count: '1,024', on: true },
      { label: 'Mid · 100–500K', count: '412', on: true },
      { label: 'Macro · 500K+', count: '96', on: false }
    ]
  },
  {
    title: 'VERIFICATION',
    items: [
      { label: 'ID verified', count: '1,180', on: true },
      { label: 'API-linked metrics', count: '904', on: true },
      { label: 'Past Ndorsify deals', count: '628', on: false }
    ]
  }
]
export const discoveryChips = [
  'clean skincare',
  'Instagram + TikTok',
  'micro–mid',
  'ID verified'
]
export const sampleCreators = [
  {
    id: 101,
    initials: 'MO',
    name: 'Maya Okonkwo',
    handle: '@mayaokonkwo',
    location: 'Lagos, NG',
    niche: 'Skincare',
    platform: 'Instagram',
    followers: '184K',
    engagement: '6.4%',
    rate: '$3,200',
    verified: true
  },
  {
    id: 102,
    initials: 'DL',
    name: 'Dara Leigh',
    handle: '@daraleigh',
    location: 'Austin, US',
    niche: 'Clean beauty',
    platform: 'TikTok',
    followers: '92K',
    engagement: '5.1%',
    rate: '$1,900',
    verified: true
  },
  {
    id: 103,
    initials: 'RN',
    name: 'Renu Nair',
    handle: '@renu.derm',
    location: 'Mumbai, IN',
    niche: 'Derm science',
    platform: 'YouTube',
    followers: '311K',
    engagement: '4.2%',
    rate: '$4,500',
    verified: true
  },
  {
    id: 104,
    initials: 'TC',
    name: 'Tomi Cole',
    handle: '@tomicole',
    location: 'London, UK',
    niche: 'Minimal skincare',
    platform: 'Instagram',
    followers: '58K',
    engagement: '7.0%',
    rate: '$1,400',
    verified: false
  },
  {
    id: 105,
    initials: 'AK',
    name: 'Amara Kealoha',
    handle: '@amara.k',
    location: 'Honolulu, US',
    niche: 'SPF & sun care',
    platform: 'TikTok',
    followers: '128K',
    engagement: '5.8%',
    rate: '$2,600',
    verified: true
  },
  {
    id: 106,
    initials: 'JP',
    name: 'Jia Park',
    handle: '@jiapark',
    location: 'Seoul, KR',
    niche: 'K-beauty',
    platform: 'Instagram',
    followers: '246K',
    engagement: '4.9%',
    rate: '$3,800',
    verified: true
  },
  {
    id: 107,
    initials: 'FE',
    name: 'Femi Ade',
    handle: '@femiade',
    location: 'Accra, GH',
    niche: "Men's grooming",
    platform: 'YouTube',
    followers: '74K',
    engagement: '6.1%',
    rate: '$1,650',
    verified: false
  },
  {
    id: 108,
    initials: 'SV',
    name: 'Sofia Vidal',
    handle: '@sofiavidal',
    location: 'Madrid, ES',
    niche: 'Barrier repair',
    platform: 'Instagram',
    followers: '163K',
    engagement: '5.4%',
    rate: '$2,950',
    verified: true
  },
  {
    id: 109,
    initials: 'HL',
    name: 'Hana Löwe',
    handle: '@hanalowe',
    location: 'Berlin, DE',
    niche: 'Fragrance-free',
    platform: 'TikTok',
    followers: '89K',
    engagement: '6.7%',
    rate: '$1,800',
    verified: true
  }
]

/* ---- 1c creator profile -------------------------------------------------- */
export const profileStats = [
  { value: '184K', label: 'Followers' },
  { value: '6.4%', label: 'Engagement' },
  { value: '4.9★', label: 'Brand rating' },
  { value: '31', label: 'Campaigns' },
  { value: '~4h', label: 'Reply time' }
]
export const portfolio = [
  {
    slot: 'Reel · ceramide routine',
    caption: 'Barrier basics',
    metric: '412K views'
  },
  { slot: 'Carousel · SPF test', caption: 'SPF myths', metric: '68K saves' },
  {
    slot: 'Reel · double cleanse',
    caption: 'PM routine',
    metric: '221K views'
  },
  {
    slot: 'Story set · unboxing',
    caption: 'First impressions',
    metric: '38K reach'
  }
]
export const pastCampaigns = [
  {
    brand: 'Kettle & Fern',
    date: 'Feb 2026',
    deliverable: '2 Reels',
    reach: '520K',
    engagement: '6.1%',
    cpm: '$9.20'
  },
  {
    brand: 'Aurelia',
    date: 'Dec 2025',
    deliverable: '1 Reel + 3 Stories',
    reach: '388K',
    engagement: '5.4%',
    cpm: '$11.10'
  },
  {
    brand: 'Northwind',
    date: 'Oct 2025',
    deliverable: 'Carousel',
    reach: '210K',
    engagement: '7.0%',
    cpm: '$7.80'
  },
  {
    brand: 'Bloom',
    date: 'Aug 2025',
    deliverable: '2 Reels',
    reach: '441K',
    engagement: '5.9%',
    cpm: '$9.90'
  }
]
export const audience = [
  { label: 'Women 25–34', value: '58%' },
  { label: 'Nigeria', value: '34%' },
  { label: 'United States', value: '22%' },
  { label: 'United Kingdom', value: '14%' }
]

/* ---- 2a creator inbox ---------------------------------------------------- */
export const creatorTiles = [
  {
    label: 'NEW INVITES',
    value: '4',
    delta: '+2',
    note: 'this week',
    up: true
  },
  {
    label: 'IN NEGOTIATION',
    value: '2',
    delta: '$5.6k',
    note: 'offered',
    up: true
  },
  {
    label: 'AVG OFFER',
    value: '$2,480',
    delta: '+8%',
    note: 'vs Q4',
    up: true
  },
  {
    label: 'RESPONSE RATE',
    value: '96%',
    delta: '~4h',
    note: 'reply time',
    up: true
  }
]
export const sampleInvites = [
  {
    logo: 'K&F',
    brand: 'Kettle & Fern',
    fit: '94% fit',
    campaign: 'Spring Glow Launch · barrier serum',
    deliverables: '2 Reels + 3 Stories',
    offer: '$2,800',
    vsRate: 'vs $3,200 rate',
    expiry: 'Expires 41h',
    expiryWarn: true,
    usage: 'Organic only'
  },
  {
    logo: 'AUR',
    brand: 'Aurelia',
    fit: '88% fit',
    campaign: 'Night Repair relaunch',
    deliverables: '1 Reel',
    offer: '$1,900',
    vsRate: 'at rate card',
    expiry: 'Expires 3d',
    expiryWarn: false,
    usage: 'Organic + ads 30d'
  },
  {
    logo: 'NW',
    brand: 'Northwind',
    fit: '81% fit',
    campaign: 'Mineral SPF drop',
    deliverables: 'Carousel + 2 Stories',
    offer: '$1,500',
    vsRate: 'vs $1,800 rate',
    expiry: 'Expires 5d',
    expiryWarn: false,
    usage: 'Organic only'
  },
  {
    logo: 'BLM',
    brand: 'Bloom',
    fit: '77% fit',
    campaign: 'Body care sampling',
    deliverables: '3 Stories',
    offer: '$850',
    vsRate: 'below rate',
    expiry: 'Expires 6d',
    expiryWarn: false,
    usage: 'Product seeded'
  }
]
export const profileTodos = [
  { done: true, label: 'Connect Instagram metrics', gain: 'done' },
  { done: false, label: 'Add 2 recent Reels to portfolio', gain: '+6 pts' },
  { done: false, label: 'Set rate for Stories package', gain: '+4 pts' }
]
export const creatorSchedule = [
  {
    day: 'MON',
    task: 'Film ceramide serum Reel',
    brand: 'Kettle & Fern',
    tag: 'Filming',
    warn: false
  },
  {
    day: 'WED',
    task: 'Draft due for approval',
    brand: 'Aurelia',
    tag: 'Due',
    warn: true
  },
  {
    day: 'THU',
    task: 'Go live · SPF carousel',
    brand: 'Northwind',
    tag: 'Publish',
    warn: false
  },
  {
    day: 'FRI',
    task: 'Payout · Night Repair',
    brand: 'Aurelia',
    tag: 'Payout',
    warn: false
  }
]

/* ---- 2b offer ------------------------------------------------------------ */
export const offerLines = [
  {
    type: 'Instagram Reel',
    spec: '30–45s, product in first 3s',
    qty: '2',
    yours: '$1,600',
    offered: '$1,400',
    under: true
  },
  {
    type: 'Instagram Stories',
    spec: 'Swipe-up to product page',
    qty: '3',
    yours: '$300',
    offered: '$300',
    under: false
  },
  {
    type: 'Usage rights',
    spec: 'Organic only, 30 days',
    qty: '1',
    yours: 'incl.',
    offered: 'incl.',
    under: false
  }
]
export const brandTrust = [
  { label: 'Deals completed', value: '38' },
  { label: 'Avg creator rating', value: '4.8★' },
  { label: 'On-time payout', value: '100%' },
  { label: 'Repeat creators', value: '61%' }
]

/* ---- 2c editor nav / platforms ------------------------------------------ */
export const editorNav = [
  { label: 'Basics', badge: '', active: false },
  { label: 'Rate card', badge: '3', active: true },
  { label: 'Portfolio', badge: '8', active: false },
  { label: 'Platforms', badge: '4', active: false },
  { label: 'Audience', badge: '', active: false },
  { label: 'Availability', badge: '', active: false }
]

/* ---- 2d earnings --------------------------------------------------------- */
export const earningTiles = [
  { label: 'PAID · 2026 YTD', value: '$18,240', note: 'across 11 campaigns' },
  { label: 'IN ESCROW', value: '$6,300', note: '3 deliverables pending' },
  { label: 'AVAILABLE', value: '$4,350', note: 'ready to withdraw' },
  { label: 'AVG PER DEAL', value: '$2,480', note: '+8% vs Q4' }
]
export const samplePayouts = [
  {
    campaign: 'Spring Glow Launch',
    deliverable: '2 Reels + 3 Stories',
    brand: 'Kettle & Fern',
    amount: '$2,800',
    releases: 'Apr 12',
    status: 'In escrow',
    state: 'escrow'
  },
  {
    campaign: 'Night Repair relaunch',
    deliverable: '1 Reel',
    brand: 'Aurelia',
    amount: '$1,900',
    releases: 'Apr 10',
    status: 'Releasing',
    state: 'releasing'
  },
  {
    campaign: 'Mineral SPF drop',
    deliverable: 'Carousel',
    brand: 'Northwind',
    amount: '$1,500',
    releases: 'Mar 28',
    status: 'Paid',
    state: 'paid'
  },
  {
    campaign: 'K-beauty haul',
    deliverable: '2 Reels',
    brand: 'Poms',
    amount: '$3,200',
    releases: 'Mar 15',
    status: 'Paid',
    state: 'paid'
  },
  {
    campaign: 'Body care sampling',
    deliverable: '3 Stories',
    brand: 'Bloom',
    amount: '$850',
    releases: 'Mar 02',
    status: 'Paid',
    state: 'paid'
  }
]
export const creatorDocs = [
  { ext: 'PDF', name: 'W-8BEN · 2026.pdf', meta: 'signed Jan 4' },
  { ext: 'CSV', name: 'Earnings_2026_YTD.csv', meta: '11 rows' },
  { ext: 'PDF', name: 'Invoice · Kettle & Fern.pdf', meta: 'Apr 2026' }
]

/* ---- 1e campaign builder ------------------------------------------------- */
export const builderSteps = [
  { title: 'Basics', hint: 'Name, goal, dates', state: 'done' },
  { title: 'Audience', hint: 'Who you want to reach', state: 'done' },
  { title: 'Deliverables', hint: 'What creators produce', state: 'current' },
  { title: 'Timeline', hint: 'Milestones & review', state: 'todo' },
  { title: 'Shortlist', hint: 'Invite your creators', state: 'todo' }
]
export const builderDeliverables = [
  {
    type: 'Instagram Reel',
    spec: '30–45s, product in first 3s',
    qty: '2',
    rate: '$1,600'
  },
  {
    type: 'Instagram Stories',
    spec: 'Swipe-up to product page',
    qty: '3',
    rate: '$300'
  },
  { type: 'TikTok video', spec: 'Native, 20–40s', qty: '1', rate: '$1,200' }
]
export const budgetLines = [
  { label: 'Creator rates (8)', value: '$32,800' },
  { label: 'Paid usage add-on', value: '$6,400' },
  { label: 'Ndorsify service', value: '$2,900' },
  { label: 'Escrow hold', value: '$500' }
]
export const builderShortlist = [
  { initials: 'MO', name: 'Maya Okonkwo', rate: '$3,200' },
  { initials: 'DL', name: 'Dara Leigh', rate: '$1,900' },
  { initials: 'AK', name: 'Amara Kealoha', rate: '$2,600' },
  { initials: 'SV', name: 'Sofia Vidal', rate: '$2,950' }
]

/* ---- 1d brand dashboard -------------------------------------------------- */
export const brandKpis = [
  {
    label: 'ACTIVE CAMPAIGNS',
    value: '6',
    delta: '+2',
    note: 'this month',
    up: true
  },
  {
    label: 'CREATORS BOOKED',
    value: '38',
    delta: '+9',
    note: 'vs last 30d',
    up: true
  },
  {
    label: 'BUDGET USED',
    value: '$128K',
    delta: '72%',
    note: 'of $178K',
    up: true
  },
  {
    label: 'BLENDED CPM',
    value: '$9.40',
    delta: '-6%',
    note: 'improving',
    down: true
  }
]
export const brandCampaigns = [
  {
    name: 'Spring Glow Launch',
    window: 'Apr 6 – May 4',
    creators: '+6',
    spend: '$18.4K / $32K',
    pct: '58%',
    reach: '1.2M',
    status: 'Live',
    state: 'live'
  },
  {
    name: 'Mineral SPF drop',
    window: 'Mar 20 – Apr 18',
    creators: '+4',
    spend: '$9.1K / $16K',
    pct: '57%',
    reach: '640K',
    status: 'Live',
    state: 'live'
  },
  {
    name: 'Night Repair relaunch',
    window: 'Apr 1 – Apr 30',
    creators: '+3',
    spend: '$5.6K / $14K',
    pct: '40%',
    reach: '388K',
    status: 'Review',
    state: 'review'
  },
  {
    name: 'Body care sampling',
    window: 'May 2 – May 30',
    creators: '+8',
    spend: '$0 / $9K',
    pct: '4%',
    reach: '—',
    status: 'Draft',
    state: 'draft'
  }
]
export const brandActivity = [
  {
    dot: '#574FE0',
    text: 'Devin Marsh countered Spring Glow at $4,800.',
    time: '12m ago'
  },
  {
    dot: '#10A08A',
    text: 'Maya Okonkwo accepted your invite.',
    time: '48m ago'
  },
  {
    dot: '#10A08A',
    text: 'Sofia Vidal submitted a Reel draft for approval.',
    time: '2h ago'
  },
  {
    dot: '#B87B12',
    text: 'Mineral SPF drop is 3 days from its deadline.',
    time: '5h ago'
  },
  {
    dot: '#574FE0',
    text: 'Amara Kealoha viewed your brief.',
    time: 'Yesterday'
  },
  {
    dot: '#10A08A',
    text: 'Payout released to Renu Nair — $4,500.',
    time: 'Yesterday'
  }
]

/* ---- 1f messages --------------------------------------------------------- */
export const sampleThreads = [
  {
    id: 1,
    initials: 'MO',
    name: 'Maya Okonkwo',
    time: '10:24',
    campaign: 'Spring Glow Launch',
    preview:
      'The ingredient angle works — the Story set needs its own script pass, which I price separately.',
    unread: true,
    active: true
  },
  {
    id: 2,
    initials: 'DM',
    name: 'Devin Marsh',
    time: '9:02',
    campaign: 'Spring Glow Launch',
    preview:
      'Countered at $4,800 for the full bundle. Can do perpetual usage for +$600.',
    unread: true,
    active: false
  },
  {
    id: 3,
    initials: 'SV',
    name: 'Sofia Vidal',
    time: 'Yest',
    campaign: 'Night Repair relaunch',
    preview: 'Draft is up for approval — let me know on the CTA wording.',
    unread: false,
    active: false
  },
  {
    id: 4,
    initials: 'AK',
    name: 'Amara Kealoha',
    time: 'Yest',
    campaign: 'Mineral SPF drop',
    preview: 'Accepted! Sending availability for the shoot week.',
    unread: false,
    active: false
  },
  {
    id: 5,
    initials: 'RN',
    name: 'Renu Nair',
    time: 'Mar 22',
    campaign: 'Derm science series',
    preview: 'Payment received, thank you. Happy to do a follow-up.',
    unread: false,
    active: false
  },
  {
    id: 6,
    initials: 'JP',
    name: 'Jia Park',
    time: 'Mar 20',
    campaign: 'K-beauty haul',
    preview: 'Posted — reach is already past 300K on the first Reel.',
    unread: false,
    active: false
  }
]
export const sampleThreadMessages = [
  {
    fromMe: false,
    text: 'Hi Rachel — love the barrier-repair brief. My SPF carousel is the closest reference for tone.',
    meta: 'Maya · 9:58'
  },
  {
    fromMe: true,
    text: "Perfect, that's exactly the honesty we want. Can you do 2 Reels + 3 Stories by Apr 20?",
    meta: 'You · 10:06'
  },
  {
    fromMe: false,
    text: 'Yes on the Reels. The ingredient angle works for my audience — the Story set needs its own script pass, which I price separately.',
    meta: 'Maya · 10:24'
  }
]
