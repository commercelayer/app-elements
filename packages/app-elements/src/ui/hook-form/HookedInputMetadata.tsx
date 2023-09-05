import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { useFormContext } from 'react-hook-form'
import { HookedInput } from './HookedInput'

interface Props {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputMetadata` component ready to be used with the `react-hook-form` context.
 * Metadata is stored in form state as object of strings (example: `{foo: 'bar'}` )
 * and should match the core api metadata structure. Non-string values are ignored and will not appear
 * in the form state.
 * @see InputMetadata
 */
function HookedInputMetadata({ name }: Props): JSX.Element {
  const { getValues } = useFormContext()

  const metadata = getValues(name) ?? {}

  if (Object.keys(metadata).length === 0) return <div>Missing Metadata</div>

  return (
    <>
      {Object.entries(metadata).map(([metadataKey, metadataValue], idx) => {
        if (typeof metadataValue !== 'string') return <></>

        return (
          <ListItem tag='div' key={idx}>
            <Text variant='info' className='capitalize'>
              {metadataKey}
            </Text>
            <HookedInput name={`${name}.${metadataKey}`} />
          </ListItem>
        )
      })}
    </>
  )
}

HookedInputMetadata.displayName = 'HookedInputMetadata'
export { HookedInputMetadata }
