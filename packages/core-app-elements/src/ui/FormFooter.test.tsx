import { FormFooter } from './FormFooter'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  hasCancelButton: boolean
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, hasCancelButton }: SetupProps): SetupResult => {
  const utils = render(
    <FormFooter
      data-test-id={id}
      buttonSubmit={<button type='submit'>Submit</button>}
      buttonCancel={
        hasCancelButton ? <button type='button'>Cancel</button> : undefined
      }
    />
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Label', () => {
  test('Should render both submit and cancel button', () => {
    const { element } = setup({ id: 'my-form-footer', hasCancelButton: true })
    expect(element).toBeInTheDocument()

    const buttons = element.querySelectorAll('button')
    expect(buttons[0].innerHTML).toBe('Submit')
    expect(buttons[1].innerHTML).toBe('Cancel')
  })

  test('Should be render also when buttonCancel is not defined', () => {
    const { element } = setup({ id: 'my-form-footer', hasCancelButton: false })
    expect(element).toBeInTheDocument()

    const buttons = element.querySelectorAll('button')
    expect(buttons[0].innerHTML).toBe('Submit')
    expect(buttons[1]).toBe(undefined)
  })
})
