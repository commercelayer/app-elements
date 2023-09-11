import { Button } from '#ui/atoms/Button'
import { Section } from '#ui/atoms/Section'
import { Spacer } from '#ui/atoms/Spacer'
import { ListItem } from '#ui/composite/ListItem'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputSimpleSelect } from '#ui/forms/InputSimpleSelect'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputSimpleSelect> = {
  title: 'Forms/react-hook-form/HookedInputSimpleSelect',
  component: HookedInputSimpleSelect,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}
export default setup

const Template: StoryFn<typeof HookedInputSimpleSelect> = (args) => {
  const methods = useForm()

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSimpleSelect {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'ext',
  label: 'Extension',
  options: [
    { label: 'JSON', value: 'json' },
    {
      label: 'CSV',
      value: 'csv'
    }
  ]
}

export const WithinAListItem: StoryFn = () => {
  const methods = useForm({
    defaultValues: {
      format: 'csv'
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <Section title='More options' titleSize='small'>
        <ListItem tag='div'>
          <HookedInputSimpleSelect
            options={[
              { label: 'JSON', value: 'json' },
              {
                label: 'CSV',
                value: 'csv'
              }
            ]}
            name='format'
            label='Export format'
            inline
            hint={{ text: 'Select a format' }}
          />
        </ListItem>
        <ListItem tag='div'>
          <HookedInputSimpleSelect
            options={[
              { label: 'Black', value: '#000' },
              { label: 'White', value: '#FFF' },
              { label: 'Green', value: '#F00' },
              { label: 'Red', value: '#0F0' },
              { label: 'Blue', value: '#00F' }
            ]}
            name='color'
            label='Color'
            inline
          />
        </ListItem>
      </Section>
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}
