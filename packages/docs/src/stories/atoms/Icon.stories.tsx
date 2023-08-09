import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Icon, iconNames } from '#ui/atoms/Icon'
import { Text } from '#ui/atoms/Text'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
  name: 'check'
}

export const AvailableIcons: StoryFn = () => (
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
        <Icon key={name} name={name} background='black' gap='small' />
        <Text size='small' variant='info'>
          {name}
        </Text>
        <CopyToClipboard showValue={false} value={name} />
      </div>
    ))}
  </div>
)
AvailableIcons.parameters = {
  docs: {
    source: {
      code: null
    }
  }
}

export const OrderWaiting = Template.bind({})
OrderWaiting.args = {
  name: 'arrowDown',
  background: 'orange',
  gap: 'large',
  title: 'Waiting approval'
}

export const FilterView = Template.bind({})
FilterView.args = {
  name: 'eye',
  background: 'teal',
  gap: 'small'
}
