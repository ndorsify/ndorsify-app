// Turn an RTK Query error into a human message.
export function apiErrorMessage(
  error,
  fallback = 'Something went wrong. Please try again.'
) {
  if (!error) return fallback
  if (error.status === 'FETCH_ERROR') {
    return 'Cannot reach the server. Is the backend running?'
  }
  const detail = error.data && error.data.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail.length && detail[0].msg) {
    return detail[0].msg // FastAPI 422 validation error
  }
  return fallback
}
