import { Text } from '#ui/atoms/Text'
import { fireEvent, render } from '@testing-library/react'
import { InputRadioGroup, type InputRadioGroupProps } from './InputRadioGroup'

const options: InputRadioGroupProps['options'] = [
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
    )
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
    )
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
    )
  }
]

describe('InputRadioGroup', () => {
  test('Should be rendered', () => {
    const { container } = render(
      <InputRadioGroup
        name='unique-name'
        options={options}
        onChange={() => {}}
      />
    )
    expect(container).toBeInTheDocument()
  })

  test('Should start with all radio unchecked', () => {
    const { queryAllByTestId } = render(
      <InputRadioGroup
        name='unique-name'
        options={options}
        onChange={() => {}}
      />
    )
    queryAllByTestId('InputRadioGroup-item').forEach((node) => {
      const radio = node.getElementsByTagName('input')[0]
      expect(radio).not.toBeChecked()
    })
  })

  test('Should start with one radio checked when defaultValue is set', () => {
    const { queryAllByTestId } = render(
      <InputRadioGroup
        name='unique-name'
        options={options}
        onChange={() => {}}
        defaultValue='BABYBIBXA19D9D000000XXXX'
      />
    )

    queryAllByTestId('InputRadioGroup-item').forEach((node) => {
      const radio = node.getElementsByTagName('input')[0]
      if (radio.value === 'BABYBIBXA19D9D000000XXXX') {
        expect(radio).toBeChecked()
      } else {
        expect(radio).not.toBeChecked()
      }
    })
  })

  test('Should received new value onChange', () => {
    const mockedOnChange = vi.fn()
    const { getAllByTestId } = render(
      <InputRadioGroup
        name='unique-name'
        options={options}
        onChange={mockedOnChange}
      />
    )

    const [firstItem, secondItem] = getAllByTestId('InputRadioGroup-item')
    expect(firstItem.getElementsByTagName('input')[0]).not.toBeChecked()
    expect(secondItem.getElementsByTagName('input')[0]).not.toBeChecked()

    fireEvent.click(firstItem)
    expect(firstItem.getElementsByTagName('input')[0]).toBeChecked()
    expect(secondItem.getElementsByTagName('input')[0]).not.toBeChecked()
    expect(mockedOnChange).toHaveBeenCalledWith('BABYBIBXA19D9D000000XXXX')

    // deselect item
    fireEvent.click(secondItem)
    expect(firstItem.getElementsByTagName('input')[0]).not.toBeChecked()
    expect(secondItem.getElementsByTagName('input')[0]).toBeChecked()
    expect(mockedOnChange).toHaveBeenCalledWith('BASEBHAT000000FFFFFFXXXX')
  })
})
