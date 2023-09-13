import { fireEvent, render, waitFor } from '@testing-library/react'
import { InputSelect } from './InputSelect'

describe('InputSelect', () => {
  test('should render', () => {
    const { container, getByText } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[]}
        placeholder='Please select an option'
      />
    )
    expect(container).toBeVisible()
    expect(getByText('Please select an option')).toBeVisible()
  })

  test('should render default value', () => {
    const { container, queryByText } = render(
      <InputSelect
        onSelect={() => {}}
        initialValues={[
          {
            value: 'paris',
            label: 'Paris'
          },
          {
            value: 'london',
            label: 'London'
          }
        ]}
        defaultValue={{
          value: 'paris',
          label: 'Paris'
        }}
      />
    )
    expect(container).toBeVisible()
    expect(queryByText('Paris')).toBeVisible()
    expect(queryByText('London')).toBeNull()
  })

  test('should select a value', async () => {
    const mockedOnSelect = vi.fn()
    const { container, queryByText, getByText } = render(
      <InputSelect
        onSelect={mockedOnSelect}
        initialValues={[
          {
            value: 'ABC123',
            label: 'Cap with Black Logo'
          }
        ]}
        placeholder='Please select an option'
      />
    )
    expect(container).toBeVisible()
    expect(queryByText('Please select an option')).toBeVisible()
    expect(queryByText('Cap with Black Logo')).toBeNull()

    // open select dropdown
    fireEvent.keyDown(getByText('Please select an option'), {
      key: 'ArrowDown'
    })
    await waitFor(() => queryByText('Cap with Black Logo'))
    fireEvent.click(getByText('Cap with Black Logo'))
    expect(mockedOnSelect).toHaveBeenCalledTimes(1)

    expect(queryByText('Please select an option')).toBeNull()
    expect(queryByText('Cap with Black Logo')).toBeVisible()
  })
})
