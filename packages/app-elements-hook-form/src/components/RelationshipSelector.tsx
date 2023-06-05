import { RelationshipSelector as RelationshipSelectorUi } from '@commercelayer/app-elements'
import { type RelationshipSelectorProps } from '@commercelayer/app-elements/dist/ui/resources/RelationshipSelector'
import { Controller, useFormContext } from 'react-hook-form'

interface Props
  extends Omit<RelationshipSelectorProps, 'onChange' | 'defaultValues'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function RelationshipSelector({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RelationshipSelectorUi
          {...props}
          defaultValues={field.value ?? []}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}

RelationshipSelector.displayName = 'RelationshipSelector'
export { RelationshipSelector }
