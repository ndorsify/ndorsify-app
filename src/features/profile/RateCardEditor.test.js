import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RateCardEditor, { newPackage } from './RateCardEditor'

// The editor is controlled; this wrapper supplies the state its parent owns.
function Harness({ initial = [], errors = [] }) {
  const [packages, setPackages] = useState(initial)
  return (
    <RateCardEditor packages={packages} onChange={setPackages} errors={errors} />
  )
}

const packageCards = () => screen.getAllByTestId('rate-package')

test('starts empty and adds a package', () => {
  render(<Harness />)
  expect(screen.queryAllByTestId('rate-package')).toHaveLength(0)

  userEvent.click(screen.getByRole('button', { name: /add package/i }))
  expect(packageCards()).toHaveLength(1)

  const card = packageCards()[0]
  expect(within(card).getByLabelText('Package name')).toHaveValue('New package')
  expect(within(card).getByLabelText('Price in dollars')).toHaveValue('')
  expect(within(card).getByLabelText("What's included")).toHaveValue('')
  expect(within(card).getByLabelText('Turnaround in days')).toHaveValue('7')
  expect(within(card).getByRole('button', { pressed: true })).toBeInTheDocument()

  expect(within(card).getAllByTestId('rate-item')).toHaveLength(1)
  const item = within(card).getAllByTestId('rate-item')[0]
  expect(within(item).getByDisplayValue('Instagram')).toBeInTheDocument()
  expect(within(item).getByDisplayValue('Post')).toBeInTheDocument()
  expect(within(item).getByLabelText('Item quantity')).toHaveValue('1')
})

test('adds and removes an item within a package', () => {
  render(<Harness initial={[newPackage()]} />)
  const card = packageCards()[0]
  expect(within(card).getAllByTestId('rate-item')).toHaveLength(1)

  userEvent.click(within(card).getByRole('button', { name: /add item/i }))
  expect(within(packageCards()[0]).getAllByTestId('rate-item')).toHaveLength(2)

  userEvent.click(
    within(packageCards()[0]).getAllByRole('button', { name: /remove item/i })[0]
  )
  expect(within(packageCards()[0]).getAllByTestId('rate-item')).toHaveLength(1)
})

test('removing the last item leaves the package present with zero items', () => {
  render(<Harness initial={[newPackage()]} />)
  const card = packageCards()[0]
  expect(within(card).getAllByTestId('rate-item')).toHaveLength(1)

  userEvent.click(within(card).getByRole('button', { name: /remove item/i }))

  expect(packageCards()).toHaveLength(1)
  expect(within(packageCards()[0]).queryAllByTestId('rate-item')).toHaveLength(0)
})

test('removes a package', () => {
  render(<Harness initial={[newPackage(), newPackage()]} />)
  expect(packageCards()).toHaveLength(2)

  userEvent.click(screen.getAllByRole('button', { name: /remove package/i })[0])
  expect(packageCards()).toHaveLength(1)
})

test('removing the last package returns the editor to its empty state', () => {
  render(<Harness initial={[newPackage()]} />)
  expect(packageCards()).toHaveLength(1)

  userEvent.click(screen.getByRole('button', { name: /remove package/i }))

  expect(screen.queryAllByTestId('rate-package')).toHaveLength(0)
  expect(screen.getByText(/no packages yet/i)).toBeInTheDocument()
})

test('shows an error against the package it belongs to', () => {
  render(
    <Harness
      initial={[newPackage(), newPackage()]}
      errors={[{ index: 1, message: 'Price must be a whole dollar amount of at least $1' }]}
    />
  )
  expect(within(packageCards()[0]).queryByText(/whole dollar/i)).toBeNull()
  expect(within(packageCards()[1]).getByText(/whole dollar/i)).toBeInTheDocument()
})
