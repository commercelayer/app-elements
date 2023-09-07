import { Text } from '#ui/atoms/Text'
import { fireEvent, render } from '@testing-library/react'
import {
  InputCheckboxGroup,
  type InputCheckboxGroupProps
} from './InputCheckboxGroup'

const options: InputCheckboxGroupProps['options'] = [
  {
    value: 'BABYBIBXA19D9D000000XXXX',
    content: (
      <Text
        size='small'
        tag='div'
        weight='bold'
        data-testid='CheckboxList-label'
      >
        Gray Baby Bib with Black Logo
      </Text>
    ),
    quantity: {
      min: 1,
      max: 5
    }
  },
  {
    value: 'BASEBHAT000000FFFFFFXXXX',
    content: (
      <Text
        size='small'
        tag='div'
        weight='bold'
        data-testid='CheckboxList-label'
      >
        Black Baseball Hat with White Logo
      </Text>
    ),
    quantity: {
      min: 1,
      max: 7
    }
  },
  {
    value: 'HOODIEUL000000FFFFFFLXXX',
    content: (
      <Text
        size='small'
        tag='div'
        weight='bold'
        data-testid='CheckboxList-label'
      >
        Black Unisex Lightweight Hoodie
      </Text>
    ),
    quantity: {
      min: 1,
      max: 8
    }
  }
]

describe('InputCheckboxGroup', () => {
  test('Should be rendered', () => {
    const { container } = render(
      <InputCheckboxGroup
        options={options}
        onChange={() => {}}
        defaultValues={[]}
      />
    )
    expect(container).toBeInTheDocument()
  })

  test('Should render the options with default quantity', () => {
    const { getAllByTestId } = render(
      <InputCheckboxGroup
        options={options}
        onChange={() => {}}
        defaultValues={[]}
      />
    )

    const allLabels = getAllByTestId('CheckboxList-label').map(
      (node) => node.innerHTML
    )
    expect(allLabels).toEqual([
      'Gray Baby Bib with Black Logo',
      'Black Baseball Hat with White Logo',
      'Black Unisex Lightweight Hoodie'
    ])

    const allQuantityInputs = getAllByTestId('InputCheckboxGroup-item').map(
      (node) => node.getElementsByTagName('input')[1]?.value
    )
    expect(allQuantityInputs).toEqual(['5', '7', '8'])
  })

  test('Should start with all items disabled when no defaultValues is specified', () => {
    const { queryAllByTestId } = render(
      <InputCheckboxGroup options={options} onChange={() => {}} />
    )
    queryAllByTestId('InputCheckboxGroup-item').forEach((node) => {
      const checkbox = node.getElementsByTagName('input')[0]
      expect(checkbox).not.toBeChecked()
    })
  })

  test('Should start with some checked items base on defaultValues', () => {
    const { queryAllByTestId } = render(
      <InputCheckboxGroup
        options={options}
        onChange={() => {}}
        defaultValues={[{ value: 'BABYBIBXA19D9D000000XXXX', quantity: 2 }]}
      />
    )

    queryAllByTestId('InputCheckboxGroup-item').forEach((node, idx) => {
      const inputs = node.getElementsByTagName('input')
      const checkbox = inputs[0]
      const quantity = inputs[1]
      if (idx === 0) {
        expect(checkbox).toBeChecked()
        expect(quantity?.value).toBe('2')
      } else {
        expect(checkbox).not.toBeChecked()
      }
    })
  })

  test('Should received new values onChange ', () => {
    const mockedOnChange = vi.fn()
    const { getAllByTestId } = render(
      <InputCheckboxGroup options={options} onChange={mockedOnChange} />
    )

    const [firstItem] = getAllByTestId('InputCheckboxGroup-item')
    assertToBeDefined(firstItem)

    expect(firstItem.getElementsByTagName('input')[0]).not.toBeChecked()

    // select  item
    fireEvent.click(firstItem)
    expect(firstItem.getElementsByTagName('input')[0]).toBeChecked()
    expect(mockedOnChange).toHaveBeenCalledWith([
      { value: 'BABYBIBXA19D9D000000XXXX', quantity: 5 }
    ])

    // decrement quantity
    const [firstDecrementBtn] = getAllByTestId('InputSpinner-decrement')
    assertToBeDefined(firstDecrementBtn)

    fireEvent.click(firstDecrementBtn)
    expect(mockedOnChange).toHaveBeenCalledWith([
      { value: 'BABYBIBXA19D9D000000XXXX', quantity: 4 }
    ])

    // increment quantity
    const [firstIncrementBtn] = getAllByTestId('InputSpinner-increment')
    assertToBeDefined(firstIncrementBtn)

    fireEvent.click(firstIncrementBtn)
    expect(mockedOnChange).toHaveBeenCalledWith([
      { value: 'BABYBIBXA19D9D000000XXXX', quantity: 5 }
    ])

    // deselect item
    fireEvent.click(firstItem)
    expect(mockedOnChange).toHaveBeenCalledWith([])
  })
})
