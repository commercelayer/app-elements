import { fireEvent, render } from '@testing-library/react'
import { Overlay } from './Overlay'

describe('Overlay', () => {
  test('Should be rendered', () => {
    const { getByText, getByTestId } = render(<Overlay>Hello world</Overlay>)

    expect(getByTestId('overlay')).toBeVisible()
    expect(getByText('Hello world')).toBeVisible()
  })

  test('Should accept optional actionButton rendered', () => {
    const onClick = vi.fn()
    const { getByText } = render(
      <Overlay
        button={{
          onClick,
          label: 'Action'
        }}
      >
        Hello world
      </Overlay>
    )

    expect(getByText('Action')).toBeVisible()
    fireEvent.click(getByText('Action'))
    expect(onClick).toHaveBeenCalled()
  })

  test('When has button, should apply some extra padding to the bottom covered with a white background', () => {
    const { getByTestId } = render(
      <Overlay
        button={{
          onClick: () => {},
          label: 'Action'
        }}
      >
        Hello world
      </Overlay>
    )

    expect(getByTestId('overlay-buttonContainer')).toHaveClass('pb-4 bg-white')
  })
})
