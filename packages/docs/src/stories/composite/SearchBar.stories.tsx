import { SearchBar } from '#ui/composite/SearchBar'
import type { Meta, StoryObj } from '@storybook/react'

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
    placeholder: 'Type something here...',
    onSearch(hint) {
      console.log(hint)
    },
    onClear() {
      console.log('clear')
    }
  }
}

export const NoDebounce: Story = {
  args: {
    debounceMs: 0,
    onSearch(hint) {
      console.log(hint)
    }
  }
}

export const InitialValue: Story = {
  args: {
    initialValue: 'Commerce layer',
    placeholder: 'search...',
    onSearch(hint) {
      console.log(hint)
    }
  }
}
