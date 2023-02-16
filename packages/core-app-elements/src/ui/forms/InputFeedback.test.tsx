import { InputFeedback, InputFeedbackProps } from './InputFeedback'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps extends Omit<InputFeedbackProps, 'children'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<InputFeedback data-test-id={id} {...rest} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputFeedback', () => {
  test('Should render danger variant as default', () => {
    const { element, getByText, getByTestId } = setup({
      id: 'my-input-feedback',
      message: 'Lorem ipsum'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('Lorem ipsum')).toBeInTheDocument()
    expect(getByTestId('icon-danger')).toBeInTheDocument()
  })

  test('Should rendered success variant when defined', () => {
    const { element, getByText, getByTestId } = setup({
      id: 'my-input-feedback',
      message: 'Lorem ipsum',
      variant: 'success'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('Lorem ipsum')).toBeInTheDocument()
    expect(getByTestId('icon-success')).toBeInTheDocument()
  })
})
