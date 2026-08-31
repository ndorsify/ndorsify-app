// Shared currency formatter — null-safe so a missing amount renders $0
// instead of throwing or printing "NaN".
export const money = (n) => `$${Number(n || 0).toLocaleString()}`
