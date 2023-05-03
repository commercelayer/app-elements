import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from '#ui/atoms/Grid'

const meta: Meta<typeof Grid> = {
  title: 'Atoms/Grid',
  component: Grid,
  parameters: {
    layout: 'padded'
  }
}

export default meta
type Story = StoryObj<typeof Grid>

export const Primary: Story = {
  args: {
    columns: '2',
    children: (
      <>
        <div>grid item #1</div>
        <div>grid item #2</div>
        <div>grid item #3</div>
        <div>grid item #4</div>
        <div>grid item #5</div>
      </>
    )
  }
}
