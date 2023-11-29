import { SwitchMode } from '#ui/composite/SwitchMode'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const setup: Meta<typeof SwitchMode> = {
  title: 'Composite/SwitchMode',
  component: SwitchMode,
  parameters: {
    layout: 'padded'
  }
}
export default setup

export const Default: StoryFn<typeof SwitchMode> = () => {
  const [mode, setMode] = useState<'test' | 'live'>('test')

  return <SwitchMode mode={mode} onChange={setMode} />
}
