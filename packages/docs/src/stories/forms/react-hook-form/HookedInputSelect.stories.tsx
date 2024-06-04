import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputSelect } from '#ui/forms/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputSelect> = {
  title: 'Forms/react-hook-form/HookedInputSelect',
  component: HookedInputSelect,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof HookedInputSelect> = (args) => {
  const methods = useForm({
    resolver: async (data, context) => {
      return {
        errors:
          data.city == null || data.city.length === 0
            ? { city: { type: 'required', message: 'City is required' } }
            : {},
        values: data
      }
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values): void => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSelect {...args} />
      <Spacer top='4'>
        <Button
          type='reset'
          variant='secondary'
          onClick={() => {
            methods.reset()
          }}
        >
          Reset
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.parameters = {
  docs: {
    source: {
      type: 'code'
    }
  }
}
Default.args = {
  label: 'City',
  name: 'city',
  initialValues: [
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
      label: 'London',
      isDisabled: true
    }
  ]
}

/**
 * This example shows how to use the `pathToValue` prop to store in form state
 * a value that is different from the one displayed in the select.
 * <span type="info">Here we are using storing the values of `meta.cityCode`</span>
 */
export const MultiSelect = Template.bind({})
MultiSelect.args = {
  label: 'City',
  name: 'city',
  isMulti: true,
  pathToValue: 'meta.cityCode',
  initialValues: [
    {
      value: 'paris',
      label: 'Paris',
      meta: {
        cityCode: 'EU_PARIS'
      }
    },
    {
      value: 'rome',
      label: 'Rome',
      meta: {
        cityCode: 'EU_ROME'
      },
      isDisabled: true
    },
    {
      value: 'new york',
      label: 'New York',
      meta: {
        cityCode: 'US_NY'
      }
    }
  ],
  onSelect: (value) => {
    alert(JSON.stringify(value))
  }
}

export const Clear: StoryFn<typeof HookedInputSelect> = () => {
  const methods = useForm({
    defaultValues: { city: ['paris'] }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputSelect
        name='city'
        isMulti
        label='Search resource'
        initialValues={MultiSelect.args?.initialValues ?? []}
        placeholder='Type to filter list...'
      />
      <Spacer top='4'>
        <Button
          type='reset'
          variant='secondary'
          onClick={() => {
            methods.reset()
          }}
        >
          Reset
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}
