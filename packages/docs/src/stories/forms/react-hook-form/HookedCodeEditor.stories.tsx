import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedCodeEditor } from '#ui/forms/CodeEditor'
import { HookedForm } from '#ui/forms/Form'
import { type Meta, type StoryFn } from '@storybook/react'
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
              id: 'dkt7685f-7760-452e-b9b4-83434b89e2a4',
              name: 'Discount products that are not already discounted (by diff price_amount_cents compared_at_amount_cents)',
              conditions: [
                {
                  field:
                    'order.line_items.diff_cents_compare_at_amount_unit_amount',
                  matcher: 'eq',
                  value: 0,
                  group: 'discountable_items'
                }
              ],
              actions: [
                {
                  type: 'percentage',
                  selector: 'order.line_items.sku',
                  groups: ['discountable_items'],
                  value: '10%'
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
          jsonSchema='promotions-rules'
          height='550px'
        />
      </Spacer>
      <Spacer top='6'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}
