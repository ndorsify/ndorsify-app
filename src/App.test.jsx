import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './app/store'

test('an unauthenticated visitor sees the public landing page', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(
    screen.getByRole('heading', {
      name: /connect brands with the right creators/i
    })
  ).toBeInTheDocument()
})
