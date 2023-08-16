import { Badge, badgeVariants } from '#ui/atoms/Badge'
import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge
}
export default setup

const Template: StoryFn<typeof Badge> = (args) => <Badge {...args} />

export const Default = Template.bind({})
Default.args = {
  variant: 'success',
  label: 'completed'
}

/** These are all the possible values for the `variant` prop. */
export const AvailableVariants: StoryFn = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gridAutoFlow: 'row',
      gap: '1rem'
    }}
  >
    {badgeVariants.sort().map((name) => (
      <div key={name} className='flex flex-row gap-2 items-center align-middle'>
        <Badge key={name} variant={name} label={name} />
        <CopyToClipboard showValue={false} value={name} />
      </div>
    ))}
  </div>
)
AvailableVariants.parameters = {
  docs: {
    source: {
      code: null
    }
  }
}

export const Simple = Template.bind({})
Simple.args = {
  variant: 'warning',
  label: 'TEST DATA'
}

export const Solid = Template.bind({})
Solid.args = {
  variant: 'warning-solid',
  label: 'TEST DATA'
}
