import { Badge } from '#ui/atoms/Badge'
import { variantCss } from '#ui/atoms/Badge/badgeVariants'
import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const badgeVariants = Object.keys(variantCss) as Array<keyof typeof variantCss>

const setup: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge
}
export default setup

const Template: StoryFn<typeof Badge> = (args) => (
  <Badge {...args}>completed</Badge>
)

export const Default = Template.bind({})
Default.args = {
  variant: 'success'
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  variant: 'success',
  icon: 'pulse'
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
        <Badge key={name} variant={name}>
          {name}
        </Badge>
        <CopyToClipboard showValue={false} value={name} />
      </div>
    ))}
  </div>
)
AvailableVariants.parameters = {
  docs: {
    canvas: {
      // This will remove the "show code" button
      // https://storybook.js.org/docs/api/doc-blocks/doc-block-canvas#sourcestate
      sourceState: 'none'
    }
  }
}
