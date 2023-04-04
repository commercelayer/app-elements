import { RadioButtons, type RadioButtonsProps } from './RadioButtons'
import { render, type RenderResult } from '@testing-library/react'
import { type RadioOptionValue } from '#ui/forms/RadioButtons'
import { useState } from 'react'

interface SetupProps extends Omit<RadioButtonsProps, 'onChange'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

function RadioButtonsImplementation({
  id,
  value,
  ...rest
}: SetupProps): JSX.Element {
  const [state, setState] = useState<RadioOptionValue | undefined>(value)
  return (
    <RadioButtons
      {...rest}
      data-test-id={id}
      id={id}
      onChange={setState}
      value={state}
    />
  )
}

const setup = (props: SetupProps): SetupResult => {
  const utils = render(<RadioButtonsImplementation {...props} />)
  const element = utils.getByTestId(props.id)
  return {
    element,
    ...utils
  }
}

describe('RadioButtons', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'radio-gaga',
      options: [
        { label: 'Shippable', value: true },
        { label: 'Not Shippable', value: false }
      ]
    })
    expect(element).toBeInTheDocument()
    expect(element.querySelectorAll('input')?.length).toBe(2)
    expect(element.querySelectorAll('label')?.length).toBe(2)
  })

  test('Can have default checked', () => {
    const { element } = setup({
      id: 'radio',
      options: [
        { label: 'Shippable', value: true },
        { label: 'Not Shippable', value: false }
      ],
      value: false
    })
    const first = element.querySelectorAll('input')[0]
    const second = element.querySelectorAll('input')[1]
    expect(first).not.toHaveAttribute('checked')
    expect(second).toHaveAttribute('checked')
  })
})
