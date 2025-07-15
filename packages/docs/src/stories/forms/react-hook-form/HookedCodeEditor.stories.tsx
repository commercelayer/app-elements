import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedCodeEditor } from '#ui/forms/CodeEditor'
import { HookedForm } from '#ui/forms/Form'
import { type Meta, type StoryFn } from '@storybook/react-vite'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedCodeEditor> = {
  title: 'Forms/react-hook-form/HookedCodeEditor',
  component: HookedCodeEditor,
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

const Template: StoryFn<typeof HookedCodeEditor> = (args) => {
  const methods = useForm({
    defaultValues: {
      'simple-text': 'This is a simple text!\n'
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values): void => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedCodeEditor {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  label: 'Code',
  name: 'simple-text'
}

export const TypescriptCode: StoryFn<typeof HookedCodeEditor> = (args) => {
  const methods = useForm({
    defaultValues: {
      rules: JSON.stringify(
        {
          rules: [
            {
              id: 'b569f656-8bc2-4253-a19b-56062e7653ab',
              name: 'Discount 3% if paid by credit card',
              conditions: [
                {
                  field: 'order.payment_method.payment_source_type',
                  matcher: 'eq',
                  value: 'credit_cards'
                }
              ],
              actions: [
                {
                  type: 'percentage',
                  selector: 'order',
                  value: '3%'
                }
              ]
            }
          ]
        },
        undefined,
        2
      ).concat('\n'),
      json: JSON.stringify({ name: 'Marco' }, undefined, 2).concat('\n')
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values): void => {
        alert(JSON.stringify(values))
      }}
    >
      <Spacer top='4'>
        <HookedCodeEditor name='json' label='JSON' language='json' />
      </Spacer>
      <Spacer top='4'>
        <HookedCodeEditor
          name='rules'
          label='Rules'
          language='json'
          jsonSchema='order-rules'
          height='470px'
        />
      </Spacer>
      <Spacer top='6'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}
