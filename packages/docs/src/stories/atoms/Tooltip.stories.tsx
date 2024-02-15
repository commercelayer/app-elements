import { Icon } from '#ui/atoms/Icon'
import { Text } from '#ui/atoms/Text'
import { Tooltip, type TooltipRefProps } from '#ui/atoms/Tooltip'
import { type Meta, type StoryFn } from '@storybook/react'
import { useRef } from 'react'

const setup: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '50px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof Tooltip> = (args) => <Tooltip {...args} />

export const Default = Template.bind({})
Default.args = {
  id: 'my-tooltip',
  label: 'Hover me',
  content: 'This is a tooltip.'
}

/**
 * Both label and content can be any ReactNode.
 **/
export const WithCustomElements = Template.bind({})
WithCustomElements.args = {
  id: 'my-tooltip2',
  label: <Icon name='info' className='inline' weight='bold' size={20} />,
  content: (
    <div>
      <Text variant='warning' tag='div' weight='bold'>
        <Icon
          name='folderOpen'
          style={{
            display: 'inline-block'
          }}
        />{' '}
        I am a JSX element
      </Text>
    </div>
  )
}

/**
 * Tooltip works by default as inline element, so it can be part of a sentence.
 **/
export const Inline: StoryFn<typeof Tooltip> = (args) => (
  <div>
    We can have an{' '}
    <Tooltip
      id='inline-tooltip'
      label={<a>inline tooltip</a>}
      content='Lorem ipsum is a placeholder text commonly used.'
      direction='top'
    />{' '}
    as part of a sentence.
  </div>
)

/**
 * Tooltip can be also controller by passing a React ref and using its custom `open` and `close` method.
 *
 * In this example we are controlling the opening/closing when hovering the parent element.
 * */
export const ControlledRef: StoryFn<typeof Tooltip> = () => {
  const ref = useRef<TooltipRefProps>(null)
  const open = (): void => ref.current?.open()
  const close = (): void => ref.current?.close()

  return (
    <div onMouseEnter={open} onMouseLeave={close}>
      Hover me{' '}
      <Tooltip
        id='controlled-tooltip'
        label={<Icon name='info' className='inline' weight='bold' size={20} />}
        content='Tooltip arrow centered on the icon, but triggered from the entire parent div.'
        direction='bottom-start'
        ref={ref}
      />{' '}
      to discover more.
    </div>
  )
}
