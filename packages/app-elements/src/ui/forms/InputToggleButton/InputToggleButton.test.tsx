import { fireEvent, render, type RenderResult } from '@testing-library/react'
import { useState } from 'react'
import { act } from 'react-dom/test-utils'
import {
  InputToggleButton,
  type InputToggleButtonProps
} from './InputToggleButton'

const options: InputToggleButtonProps['options'] = [
  {
    value: 'draft',
    label: 'Draft',
    isDisabled: true
  },
  {
    value: 'placed',
    label: 'Placed'
  },
  {
    value: 'approved',
    label: 'Approved'
  },
  {
    value: 'cancelled',
    label: 'Cancelled'
  }
]

function Component(
  props: Omit<InputToggleButtonProps, 'onChange'>
): JSX.Element {
  const initialValue = props.mode === 'multi' ? props.value ?? [] : props.value
  const [value, setValue] = useState<any>(initialValue)
  return (
    <InputToggleButton
      {...props}
      value={value}
      onChange={setValue}
      data-testid='toggle-buttons'
    />
  )
}

type SetupResult = RenderResult & {
  element: HTMLElement
}
const setup = (
  props: Omit<InputToggleButtonProps, 'onChange'>
): SetupResult => {
  const utils = render(<Component {...props} />)
  const element = utils.getByTestId('toggle-buttons')
  return {
    element,
    ...utils
  }
}

function expectChecked(el: HTMLElement): void {
  expect(el).toHaveClass('bg-primary text-white')
  expect(el.getElementsByTagName('input')[0]).toBeChecked()
}
function expectNotChecked(el: HTMLElement): void {
  expect(el).toHaveClass('bg-gray-100 text-gray-500')
  expect(el.getElementsByTagName('input')[0]).not.toBeChecked()
}
function expectDisabled(el: HTMLElement): void {
  expect(el).toHaveClass('pointer-events-none touch-none')
  expect(el.getElementsByTagName('input')[0]).toBeDisabled()
}

describe('InputToggleButton single value mode', () => {
  test('should render', () => {
    const { element } = setup({
      mode: 'single',
      options
    })
    expect(element).toBeVisible()
  })

  test('should accept a default selected value', () => {
    const { getByText } = setup({
      mode: 'single',
      value: 'placed',
      options
    })
    expectChecked(getByText('Placed'))
    expectNotChecked(getByText('Approved'))
  })

  test('should change value', async () => {
    const { getByText } = setup({
      mode: 'single',
      options
    })
    expectNotChecked(getByText('Placed'))
    expectNotChecked(getByText('Cancelled'))
    act(() => {
      fireEvent.click(getByText('Placed'))
    })
    expectChecked(getByText('Placed'))
    expectNotChecked(getByText('Cancelled'))
    act(() => {
      fireEvent.click(getByText('Cancelled'))
    })
    expectNotChecked(getByText('Placed'))
    expectChecked(getByText('Cancelled'))
  })

  test('should be able to unselect in single mode', async () => {
    const { getByText } = setup({
      mode: 'single',
      options
    })
    expectNotChecked(getByText('Placed'))
    act(() => {
      fireEvent.click(getByText('Placed'))
    })
    expectChecked(getByText('Placed'))
    act(() => {
      // click again on current selected
      fireEvent.click(getByText('Placed'))
    })
    expectNotChecked(getByText('Placed'))
  })

  test('should not be able to select disabled options', async () => {
    const { getByText } = setup({
      mode: 'single',
      options
    })

    expectDisabled(getByText('Draft'))
    expectNotChecked(getByText('Draft'))
    act(() => {
      fireEvent.click(getByText('Draft'))
    })
    expectNotChecked(getByText('Draft'))
  })
})

describe('InputToggleButton multi values mode', () => {
  test('should render', () => {
    const { element } = setup({
      mode: 'multi',
      options
    })
    expect(element).toBeVisible()
  })

  test('should accept a default selected value', () => {
    const { getByText } = setup({
      mode: 'multi',
      value: ['placed', 'approved'],
      options
    })
    expectChecked(getByText('Placed'))
    expectChecked(getByText('Approved'))
  })

  test('should change values', async () => {
    const { getByText } = setup({
      mode: 'multi',
      options
    })
    expectNotChecked(getByText('Placed'))
    expectNotChecked(getByText('Approved'))

    act(() => {
      fireEvent.click(getByText('Placed'))
    })
    expectChecked(getByText('Placed'))
    expectNotChecked(getByText('Approved'))

    act(() => {
      fireEvent.click(getByText('Approved'))
    })
    expectChecked(getByText('Placed'))
    expectChecked(getByText('Approved'))
  })

  test('should be able to unselect in multi mode', async () => {
    const { getByText } = setup({
      mode: 'multi',
      options
    })
    expectNotChecked(getByText('Placed'))

    act(() => {
      fireEvent.click(getByText('Placed'))
    })
    expectChecked(getByText('Placed'))

    act(() => {
      // click again on current selected
      fireEvent.click(getByText('Placed'))
    })
    expectNotChecked(getByText('Placed'))
  })
})
