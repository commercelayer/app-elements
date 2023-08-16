import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Icon, iconNames, type IconProps } from '#ui/atoms/Icon'
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
        <Icon key={name} name={name} background='black' gap='small' />
        <Text size='small' variant='info'>
          {name}
        </Text>
        <CopyToClipboard showValue={false} value={name} />
      </div>
    ))}
  </div>
)
AvailableNames.parameters = {
  docs: {
    source: {
      code: null
    }
  }
}

/** These are all the possible values for the `background` prop. */
export const AvailableBackgrounds: StoryFn = () => {
  const backgrounds = [
    undefined,
    ...(
      Object.keys({
        black: null,
        gray: null,
        green: null,
        none: null,
        orange: null,
        red: null,
        teal: null,
        white: null
      } satisfies Record<NonNullable<IconProps['background']>, null>) as Array<
        NonNullable<IconProps['background']>
      >
    ).sort()
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridAutoFlow: 'row',
        gap: '1rem'
      }}
    >
      {backgrounds.map((name) => (
        <div
          key={name}
          className='flex flex-row gap-2 items-center align-middle'
        >
          <Icon key={name} name='check' background={name} gap='small' />
          <Text size='small' variant='info'>
            {name}
          </Text>
          <CopyToClipboard showValue={false} value={name} />
        </div>
      ))}
    </div>
  )
}
AvailableBackgrounds.parameters = {
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
