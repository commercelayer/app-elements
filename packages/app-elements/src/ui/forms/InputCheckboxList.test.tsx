import { Text } from '#ui/atoms/Text'
import { fireEvent, render } from '@testing-library/react'
import {
  InputCheckboxList,
  type InputCheckboxListProps
} from './InputCheckboxList'

const options: InputCheckboxListProps['options'] = [
  {
    value: 'BABYBIBXA19D9D000000XXXX',
    content: (
      <Text
        size='small'
        tag='div'
        weight='bold'
        data-test-id='CheckboxList-label'
      >
        Gray Baby Bib with Black Logo
      </Text>
    ),
    image: {
      url: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png',
      alt: 'Gray Baby Bib with Black Logo'
    },
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
        data-test-id='CheckboxList-label'
      >
        Black Baseball Hat with White Logo
      </Text>
    ),
    image: {
      url: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
      alt: 'Black Baseball Hat with White Logo'
    },
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
        data-test-id='CheckboxList-label'
      >
        Black Unisex Lightweight Hoodie
      </Text>
    ),
    image: {
      url: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/HOODIEUL000000FFFFFFLXXX_FLAT.png',
      alt: 'Black Unisex Lightweight Hoodie'
    },
    quantity: {
      min: 1,
      max: 8
    }
  }
]

describe('InputCheckboxList', () => {
  test('Should be rendered', () => {
    const { container } = render(
      <InputCheckboxList
        options={options}
        onChange={() => {}}
        defaultValues={[]}
      />
    )
    expect(container).toBeInTheDocument()
  })

  test('Should render the options with default quantity', () => {
    const { getAllByTestId } = render(
      <InputCheckboxList
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

    const allQuantityInputs = getAllByTestId('CheckboxList-item').map(
      (node) => node.getElementsByTagName('input')[1].value
    )
    expect(allQuantityInputs).toEqual(['5', '7', '8'])
  })

  test('Should start with all items disabled when no defaultValues is specified', () => {
    const { queryAllByTestId } = render(
      <InputCheckboxList options={options} onChange={() => {}} />
    )
    queryAllByTestId('CheckboxList-item').forEach((node) => {
      const checkbox = node.getElementsByTagName('input')[0]
      expect(checkbox).not.toBeChecked()
    })
  })

  test('Should start with some checked items base on defaultValues', () => {
    const { queryAllByTestId } = render(
      <InputCheckboxList
        options={options}
        onChange={() => {}}
        defaultValues={[{ value: 'BABYBIBXA19D9D000000XXXX', quantity: 2 }]}
      />
    )

    queryAllByTestId('CheckboxList-item').forEach((node, idx) => {
      const inputs = node.getElementsByTagName('input')
      const checkbox = inputs[0]
      const quantity = inputs[1]
      if (idx === 0) {
        expect(checkbox).toBeChecked()
        expect(quantity.value).toBe('2')
      } else {
        expect(checkbox).not.toBeChecked()
      }
    })
  })

  test('Should received new values onChange ', () => {
    const mockedOnChange = vi.fn()
    const { getAllByTestId } = render(
      <InputCheckboxList options={options} onChange={mockedOnChange} />
    )

    const firstItem = getAllByTestId('CheckboxList-item')[0]
    expect(firstItem.getElementsByTagName('input')[0]).not.toBeChecked()

    // select  item
    fireEvent.click(firstItem)
    expect(firstItem.getElementsByTagName('input')[0]).toBeChecked()
    expect(mockedOnChange).toHaveBeenCalledWith([
      { value: 'BABYBIBXA19D9D000000XXXX', quantity: 5 }
    ])

    // decrement quantity
    const firstDecrementBtn = getAllByTestId('InputSpinner-decrement')[0]
    fireEvent.click(firstDecrementBtn)
    expect(mockedOnChange).toHaveBeenCalledWith([
      { value: 'BABYBIBXA19D9D000000XXXX', quantity: 4 }
    ])

    // increment quantity
    const firstIncrementBtn = getAllByTestId('InputSpinner-increment')[0]
    fireEvent.click(firstIncrementBtn)
    expect(mockedOnChange).toHaveBeenCalledWith([
      { value: 'BABYBIBXA19D9D000000XXXX', quantity: 5 }
    ])

    // deselect item
    fireEvent.click(firstItem)
    expect(mockedOnChange).toHaveBeenCalledWith([])
  })
})
