import { Section } from '#ui/atoms/Section'
import { ListItem } from '#ui/composite/ListItem'
import { InputSwitch } from '#ui/forms/InputSwitch'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputSwitch> = {
  title: 'Forms/ui/InputSwitch',
  component: InputSwitch,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof InputSwitch> = (args) => {
  return <InputSwitch {...args} />
}

export const Default = Template.bind({})
Default.args = {
  name: 'sound-on',
  label: 'Sound on'
}

export const WithHint = Template.bind({})
WithHint.args = {
  name: 'sound-on-with-hint',
  label: 'Sound on',
  hint: {
    text: 'Turn sound on'
  }
}

export const WithError = Template.bind({})
WithError.args = {
  name: 'sound-on-with-error',
  label: 'Sound on',
  feedback: {
    variant: 'danger',
    message: 'You do not have enough permission'
  },
  hint: {
    text: 'Turn sound on'
  }
}

export const Row = Template.bind({})
Row.args = {
  name: 'sound-on-row',
  label: 'Sound on',
  inline: true,
  hint: {
    text: 'Turn sound on'
  }
}

export const DefaultChecked = Template.bind({})
DefaultChecked.args = {
  name: 'sound-on-default-checked',
  label: 'Sound on',
  defaultChecked: true
}

export const WithoutLabel = Template.bind({})
WithoutLabel.args = {
  name: 'sound-on-without-label'
}

export const WithinAListItem: StoryFn = () => {
  return (
    <Section title='More options' titleSize='small'>
      <ListItem tag='div'>
        <InputSwitch name='export-all' label='Export all' inline />
      </ListItem>
      <ListItem tag='div'>
        <InputSwitch
          name='exclude-last'
          label='Exclude last'
          inline
          hint={{ text: 'Exclude the last item from the export' }}
        />
      </ListItem>
    </Section>
  )
}
