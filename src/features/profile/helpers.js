// Convert between a comma-separated text field and a string array.
export const splitList = (text) =>
  (text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

export const joinList = (arr) => (arr || []).join(', ')
