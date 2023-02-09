import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import Container from '#core-app-elements/atoms/Container'
import Spacer from '#core-app-elements/atoms/Spacer'
import Button from '#core-app-elements/atoms/Button'

import Form from '#app-elements-hook-form/Form'
import Input from '#app-elements-hook-form/Input'
import InputDate from '#app-elements-hook-form/InputDate'
import InputDateRange from '#app-elements-hook-form/InputDateRange'
import InputToggleBox from '#app-elements-hook-form/InputToggleBox'
import InputSelect from '#app-elements-hook-form/InputSelect'

const schema = z.object({
  companyName: z.string().min(1),
  toggle: z.literal(true),
  select: z.object({
    value: z.string(),
    label: z.string()
  })
})

export function FullForm(): JSX.Element {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      toggle: false,
      dateSingle: new Date(),
      dateRange: [],
      select: { value: 'prato', label: 'Prato' },
      multiSelect: [
        {
          value: 'yellow',
          label: 'Yellow'
        }
      ]
    }
  })

  return (
    <Container minHeight={false}>
      <Form
        {...methods}
        onSubmit={(values) => {
          console.log(values)
        }}
      >
        <Spacer bottom='4'>
          <Input
            name='companyName'
            label='Company name'
            placeholder='eg: Commerce Layer'
          />
        </Spacer>

        <Spacer bottom='4'>
          <InputDate name='dateSingle' label='Date' />
        </Spacer>

        <Spacer bottom='4'>
          <InputDateRange name='dateRange' label='Date range' />
        </Spacer>

        <Spacer bottom='4'>
          <InputSelect
            name='select'
            label='Choose one city'
            initialValues={[
              {
                value: 'florence',
                label: 'Florence'
              },
              {
                value: 'prato',
                label: 'Prato'
              },
              {
                value: 'milan',
                label: 'Milan'
              },
              {
                value: 'rome',
                label: 'Rome'
              }
            ]}
          />
        </Spacer>

        <Spacer bottom='4'>
          <InputSelect
            name='multiSelect'
            label='Choose multiple colors'
            isMulti
            initialValues={[
              {
                value: 'red',
                label: 'Red'
              },
              {
                value: 'yellow',
                label: 'Yellow'
              },
              {
                value: 'green',
                label: 'Green'
              }
            ]}
          />
        </Spacer>

        <Spacer bottom='4'>
          <InputToggleBox name='toggle' label='Toggle me' id='toggle' />
        </Spacer>

        <Button type='submit' variant='primary'>
          Submit
        </Button>
      </Form>
    </Container>
  )
}
