import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Icon } from '#ui/atoms/Icon'
import { iconMapping } from '#ui/atoms/Icon/icons'
import { Text } from '#ui/atoms/Text'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon
}
export default setup

const iconNames = Object.keys(iconMapping) as Array<keyof typeof iconMapping>

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'check',
  size: '1rem'
}

/** These are all the possible values for the `name` prop. */
export const AvailableNames: StoryFn = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gridAutoFlow: 'row',
      gap: '1rem'
    }}
  >
    {iconNames.map((name) => (
      <div key={name} className='flex flex-row gap-2 items-center align-middle'>
        <Icon key={name} name={name} />
        <Text size='small' variant='info'>
          {name}
        </Text>
        <CopyToClipboard showValue={false} value={name} />
      </div>
    ))}
  </div>
)
AvailableNames.parameters = {
  parameters: {
    layout: 'padded'
  },
  docs: {
    source: {
      code: null
    }
  }
}
