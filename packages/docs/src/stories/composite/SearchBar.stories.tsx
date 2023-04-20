import type { Meta, StoryObj } from '@storybook/react'
import { SearchBar } from '#ui/composite/SearchBar'

const meta: Meta<typeof SearchBar> = {
  title: 'Composite/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  args: {
    placeholder: 'Type something here...'
  }
}

export const NoDebounce: Story = {
  args: {
    debounceMs: 0
  }
}

export const InitialValue: Story = {
  args: {
    initialValue: 'Commerce layer',
    placeholder: 'search...'
  }
}
