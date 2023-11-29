import { fireEvent, render } from '@testing-library/react'
import { useState, type FC } from 'react'
import { SwitchMode } from './SwitchMode'

const ControlledSwitchMode: FC = () => {
  const [mode, setMode] = useState<'test' | 'live'>('test')

  return (
    <div>
      <div data-testid='current-mode'>{mode}</div>
      <SwitchMode mode={mode} onChange={setMode} />
    </div>
  )
}

describe('SwitchMode', () => {
  test('Should be rendered', async () => {
    const { getByTestId } = render(<ControlledSwitchMode />)

    expect(getByTestId('switch-mode')).toBeInTheDocument()
  })

  test('Should toggle mode', async () => {
    const { getByTestId } = render(<ControlledSwitchMode />)
    expect(getByTestId('current-mode')).toHaveTextContent('test')

    fireEvent.click(getByTestId('switch-mode'))
    expect(getByTestId('current-mode')).toHaveTextContent('live')

    fireEvent.click(getByTestId('switch-mode'))
    expect(getByTestId('current-mode')).toHaveTextContent('test')
  })
})
