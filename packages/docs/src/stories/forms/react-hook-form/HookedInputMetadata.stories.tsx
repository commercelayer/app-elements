import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputMetadata } from '#ui/forms/InputMetadata'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputMetadata> = {
  title: 'Forms/react-hook-form/HookedInputMetadata',
  component: HookedInputMetadata,
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

const Template: StoryFn<typeof HookedInputMetadata> = (args) => {
  const methods = useForm({
    defaultValues: {
      [args.name]: {
        firstname: 'John',
        lastname: 'Reed'
      }
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputMetadata {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'user'
}
