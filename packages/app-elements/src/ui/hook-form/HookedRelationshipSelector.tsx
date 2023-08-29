import {
  RelationshipSelector,
  type RelationshipSelectorProps
} from '#ui/resources/RelationshipSelector'
import { Controller, useFormContext } from 'react-hook-form'

interface Props
  extends Omit<RelationshipSelectorProps, 'onChange' | 'defaultValues'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedRelationshipSelector({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <RelationshipSelector
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

HookedRelationshipSelector.displayName = 'HookedRelationshipSelector'
export { HookedRelationshipSelector }
