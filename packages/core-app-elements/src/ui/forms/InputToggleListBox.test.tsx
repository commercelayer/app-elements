import InputToggleListBox, {
  InputToggleListBoxOption
} from './InputToggleListBox'
import { fireEvent, render, RenderResult } from '@testing-library/react'
import { useState } from 'react'

interface SetupProps {
  id: string
  label: string
  description?: React.ReactNode
  value: string
  options: InputToggleListBoxOption[]
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

function ToggleImplementation({
  id,
  label,
  value,
  options
}: SetupProps): JSX.Element {
  const [selected, setSelected] = useState(value)
  return (
    <InputToggleListBox
      id={id}
      data-test-id={id}
      label={label}
      value={selected}
      onChange={({ currentTarget: { value } }) => setSelected(value)}
      options={options}
    />
  )
}

const setup = (props: SetupProps): SetupResult => {
  const utils = render(<ToggleImplementation {...props} />)
  const element = utils.getByTestId(props.id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('ToggleImplementation', () => {
  const options = [
    { label: 'Item 1', value: 'item-1' },
    { label: 'Item 2', value: 'item-2' },
    { label: 'Item 3', value: 'item-3' }
  ]

  test('Should be rendered', () => {
    const { element, getByLabelText } = setup({
      id: 'toggle-list-box',
      label: 'Select an item',
      value: 'item-1',
      options
    })
    expect(element).toBeInTheDocument()
    expect(element.value).toBe('item-1')
    expect(getByLabelText('Select an item')).toBeInTheDocument()
  })

  test('Should be able to switch between values', () => {
    const { element } = setup({
      id: 'my-toggle',
      label: 'Cleanup records?',
      value: 'item-1',
      options
    })
    expect(element).toBeInTheDocument()
    fireEvent.change(element, { target: { value: 'item-3' } })
    expect(element.value).toBe('item-3')
  })
})
