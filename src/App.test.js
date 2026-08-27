import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './app/store'

test('an unauthenticated visitor is routed to the sign-in screen', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(
    screen.getByRole('heading', { name: /sign in/i })
  ).toBeInTheDocument()
})
