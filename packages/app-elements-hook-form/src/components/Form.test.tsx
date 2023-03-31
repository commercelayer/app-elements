import { render, RenderResult } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { Form } from './Form'
import { Input } from './Input'
import { InputToggleBox } from './InputToggleBox'
import { InputDate } from './InputDate'
import { InputDateRange } from './InputDateRange'
import { InputCheckbox } from './InputCheckbox'
import { InputSelect } from './InputSelect'
import { ToggleButtons } from './ToggleButtons'

type SetupResult = RenderResult & {
  element: HTMLElement
}

function FullFormScreen({ id }: { id: string }): JSX.Element {
  const methods = useForm()
  return (
    <div data-test-id={id}>
      <Form {...methods} onSubmit={() => {}}>
        <Input name='companyName' label='Company name' />
        <InputDate name='dateSingle' label='Date' />
        <InputDateRange name='dateRange' label='Date range' />
        <InputSelect
          name='select'
          label='Choose one city'
          initialValues={[{ value: 'foo', label: 'foobar' }]}
          pathToValue='label'
        />
        <InputToggleBox name='toggle' label='Toggle me' id='toggle' />
        <InputCheckbox name='checkbox' icon={<div />}>
          check me
        </InputCheckbox>
        <ToggleButtons
          name='toggleButtons'
          options={[
            {
              value: 'authorized',
              label: 'Authorized'
            },
            {
              value: 'paid',
              label: 'Paid'
            }
          ]}
          mode='multi'
        />
      </Form>
    </div>
  )
}

const setup = (): SetupResult => {
  const utils = render(<FullFormScreen id='full-form' />)
  const element = utils.getByTestId('full-form')
  return {
    element,
    ...utils
  }
}

describe('Form with all inputs', () => {
  test('Should be rendered', async () => {
    const { element } = setup()
    expect(element).toBeVisible()
  })
})
