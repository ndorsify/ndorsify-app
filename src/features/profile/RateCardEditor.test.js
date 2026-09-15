import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import RateCardEditor, { newPackage } from './RateCardEditor'

// The editor is controlled; this wrapper supplies the state its parent owns.
function Harness({ initial = [], errors = [] }) {
  const [packages, setPackages] = useState(initial)
  return (
    <RateCardEditor
      packages={packages}
      onChange={setPackages}
      errors={errors}
    />
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
  expect(
    within(card).getByRole('button', { pressed: true })
  ).toBeInTheDocument()

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
    within(packageCards()[0]).getAllByRole('button', {
      name: /remove item/i
    })[0]
  )
  expect(within(packageCards()[0]).getAllByTestId('rate-item')).toHaveLength(1)
})

test('removing the last item leaves the package present with zero items', () => {
  render(<Harness initial={[newPackage()]} />)
  const card = packageCards()[0]
  expect(within(card).getAllByTestId('rate-item')).toHaveLength(1)

  userEvent.click(within(card).getByRole('button', { name: /remove item/i }))

  expect(packageCards()).toHaveLength(1)
  expect(within(packageCards()[0]).queryAllByTestId('rate-item')).toHaveLength(
    0
  )
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

test('editing one item in a loaded package leaves the other item untouched', () => {
  // Mirrors data loaded from the server: items already carry stable keys
  // (as ProfileEditPage's seeding effect now mints), not freshly-minted
  // ones from newItem(). Two items with distinct values guard against a
  // row-identity mixup if item rows were ever keyed by position instead.
  const pkg = {
    ...newPackage(),
    items: [
      { key: 'saved-0-0', platform: 'instagram', type: 'post', quantity: 1 },
      { key: 'saved-0-1', platform: 'tiktok', type: 'video', quantity: 2 }
    ]
  }
  render(<Harness initial={[pkg]} />)
  const card = packageCards()[0]
  const items = within(card).getAllByTestId('rate-item')
  expect(items).toHaveLength(2)

  userEvent.clear(within(items[0]).getByLabelText('Item quantity'))
  userEvent.type(within(items[0]).getByLabelText('Item quantity'), '9')

  const updatedItems = within(packageCards()[0]).getAllByTestId('rate-item')
  expect(within(updatedItems[0]).getByLabelText('Item quantity')).toHaveValue(
    '9'
  )
  expect(
    within(updatedItems[1]).getByDisplayValue('TikTok')
  ).toBeInTheDocument()
  expect(within(updatedItems[1]).getByDisplayValue('Video')).toBeInTheDocument()
  expect(within(updatedItems[1]).getByLabelText('Item quantity')).toHaveValue(
    '2'
  )
})

test('hides "+ Add package" once the package cap is reached', () => {
  const packages = Array.from({ length: 10 }, () => newPackage())
  render(<Harness initial={packages} />)
  expect(packageCards()).toHaveLength(10)
  expect(
    screen.queryByRole('button', { name: /add package/i })
  ).not.toBeInTheDocument()
})

test('hides "+ Add item" once a package reaches its item cap', () => {
  const pkg = {
    ...newPackage(),
    items: Array.from({ length: 10 }, (_, j) => ({
      key: `cap-item-${j}`,
      platform: 'instagram',
      type: 'post',
      quantity: 1
    }))
  }
  render(<Harness initial={[pkg]} />)
  const card = packageCards()[0]
  expect(within(card).getAllByTestId('rate-item')).toHaveLength(10)
  expect(
    within(card).queryByRole('button', { name: /add item/i })
  ).not.toBeInTheDocument()
})

test('shows an error against the package it belongs to', () => {
  render(
    <Harness
      initial={[newPackage(), newPackage()]}
      errors={[
        {
          index: 1,
          message: 'Price must be a whole dollar amount of at least $1'
        }
      ]}
    />
  )
  expect(within(packageCards()[0]).queryByText(/whole dollar/i)).toBeNull()
  expect(
    within(packageCards()[1]).getByText(/whole dollar/i)
  ).toBeInTheDocument()
})
