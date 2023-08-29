import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/hook-form/HookedForm'
import { useForm } from 'react-hook-form'

export const MockedHookedForm: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const methods = useForm({
    defaultValues: (window as any).hookedFormDefaultValues ?? {}
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(`form submitted with values: ${JSON.stringify(values)}`)
      }}
    >
      {children}
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

MockedHookedForm.displayName = 'HookedForm'
