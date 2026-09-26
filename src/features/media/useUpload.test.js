import { configureStore } from '@reduxjs/toolkit'
import { render, screen, waitFor } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'

import { mediaApi } from './mediaApi'
import { useUpload } from './useUpload'

// A probe that runs the hook once and renders whatever it resolves/rejects
// with, so the sign -> PUT -> key chain can be asserted end to end.
function Probe({ files }) {
  const [upload] = useUpload()
  const [result, setResult] = useState('')
  useEffect(() => {
    upload(files, { scope: 'submissions', refId: 9 })
      .then((keys) => setResult(`keys:${keys.join(',')}`))
      .catch((err) => setResult(`error:${err.message}`))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return <div data-testid="result">{result}</div>
}

const renderProbe = (files) => {
  const store = configureStore({
    reducer: {
      auth: () => ({ accessToken: 'test-token', refreshToken: null }),
      [mediaApi.reducerPath]: mediaApi.reducer
    },
    middleware: (gdm) => gdm().concat(mediaApi.middleware)
  })
  render(
    <Provider store={store}>
      <Probe files={files} />
    </Provider>
  )
}

const png = () => new File(['bytes'], 'shot.png', { type: 'image/png' })

// Enough of a Response for RTK Query's fetchBaseQuery, which clones before
// reading the body.
const jsonResponse = (body) => {
  const res = {
    ok: true,
    status: 200,
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify(body),
    json: async () => body
  }
  res.clone = () => res
  return res
}

beforeEach(() => {
  global.fetch = jest.fn()
})

afterEach(() => {
  delete global.fetch
})

test('signs, PUTs the bytes, and returns the storage key', async () => {
  global.fetch
    .mockResolvedValueOnce(
      jsonResponse({
        key: 'submissions/9/abc.png',
        upload_url: 'http://localhost:5000/media/upload/tok',
        method: 'PUT',
        headers: { 'Content-Type': 'image/png' }
      })
    )
    .mockResolvedValueOnce({ ok: true, status: 204 })

  const file = png()
  renderProbe([file])

  await waitFor(() =>
    expect(screen.getByTestId('result')).toHaveTextContent(
      'keys:submissions/9/abc.png'
    )
  )

  // The sign call carries the file's real type/size and the collaboration id.
  // fetchBaseQuery hands fetch a Request object, not (url, init).
  const signRequest = global.fetch.mock.calls[0][0]
  expect(signRequest.url).toContain('/media/sign-upload')
  expect(await signRequest.json()).toEqual({
    scope: 'submissions',
    ref_id: '9',
    content_type: 'image/png',
    size_bytes: file.size
  })
  // The bytes go straight to the signed URL, not through the API.
  const [uploadUrl, uploadRequest] = global.fetch.mock.calls[1]
  expect(uploadUrl).toBe('http://localhost:5000/media/upload/tok')
  expect(uploadRequest.method).toBe('PUT')
  expect(uploadRequest.body).toBe(file)
})

test('surfaces a failed upload against the file that failed', async () => {
  global.fetch
    .mockResolvedValueOnce(
      jsonResponse({
        key: 'submissions/9/abc.png',
        upload_url: 'http://localhost:5000/media/upload/tok',
        method: 'PUT',
        headers: { 'Content-Type': 'image/png' }
      })
    )
    .mockResolvedValueOnce({ ok: false, status: 400 })

  renderProbe([png()])

  await waitFor(() =>
    expect(screen.getByTestId('result')).toHaveTextContent(
      'error:Upload failed for “shot.png”'
    )
  )
})

test('refuses a file the browser could not type', async () => {
  renderProbe([new File(['x'], 'mystery', { type: '' })])

  await waitFor(() =>
    expect(screen.getByTestId('result')).toHaveTextContent(
      "error:Can't tell what kind of file “mystery” is"
    )
  )
  expect(global.fetch).not.toHaveBeenCalled()
})
