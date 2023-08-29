import { Button } from '#ui/atoms/Button'
import { HookedForm } from '#ui/hook-form/HookedForm'
import { HookedInputSelect } from '#ui/hook-form/HookedInputSelect'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputSelect> = {
  title: 'HookForm/HookedInputSelect',
  component: HookedInputSelect,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const BaseForm: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const methods = useForm({
    defaultValues: {
      city: ''
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(`selected: ${values.city}`)
      }}
    >
      {children}
      <Button type='submit'>Submit</Button>
    </HookedForm>
  )
}

const Template: StoryFn<typeof HookedInputSelect> = (args) => {
  return (
    <BaseForm>
      <HookedInputSelect
        {...args}
        name='city'
        initialValues={[
          {
            value: 'paris',
            label: 'Paris'
          },
          {
            value: 'rome',
            label: 'Rome'
          },
          {
            value: 'london',
            label: 'London'
          }
        ]}
      />
    </BaseForm>
  )
}

export const Default = Template.bind({})
Default.args = {}
