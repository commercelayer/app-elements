import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Icon, type IconProps } from '#ui/atoms/Icon'
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
  parameters: {
    layout: 'padded'
  },
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
  parameters: {
    layout: 'padded'
  },
  docs: {
    source: {
      code: null
    }
  }
}

export const SomeExamples: StoryFn = (_args) => {
  return (
    <>
      <Icon
        name='arrowDown'
        background='orange'
        gap='large'
        title='Waiting approval'
      />
      <Icon name='eye' background='teal' gap='small' title='Filter view' />
    </>
  )
}
SomeExamples.decorators = [
  (Story) => (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}
    >
      <Story />
    </div>
  )
]
