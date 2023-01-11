import InputReadonly from '#core-app-elements/forms/InputReadonly'
import Container from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof InputReadonly> = {
  title: 'Forms/InputReadonly',
  component: InputReadonly,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof InputReadonly> = (args) => {
  return (
    <Container minHeight={false}>
      <InputReadonly
        {...args}
        value={args.value}
        showCopyAction={args.showCopyAction}
      />
    </Container>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Secret',
  value: 'asd6as78d6asds',
  showCopyAction: true
}
