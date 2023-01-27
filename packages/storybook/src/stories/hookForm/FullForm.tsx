import { FormProvider, useForm } from 'react-hook-form'

import Container from '#core-app-elements/atoms/Container'
import Spacer from '#core-app-elements/atoms/Spacer'

import {
  Input,
  InputToggleBox,
  InputDate,
  InputDateRange,
  InputSelect
} from '@commercelayer/bo-app-elements-hook-form'

export function FullForm(): JSX.Element {
  const methods = useForm({
    defaultValues: {
      companyName: 'Commerce Layer',
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

  // console.log(methods.watch())

  return (
    <Container minHeight={false}>
      <FormProvider {...methods}>
        <Spacer bottom='4'>
          <Input name='companyName' label='Company name' />
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

        <button
          type='button'
          onClick={() => {
            methods.setError('toggle', {
              message: 'this is a custom error message'
            })
          }}
        >
          set fake error
        </button>
      </FormProvider>
    </Container>
  )
}
