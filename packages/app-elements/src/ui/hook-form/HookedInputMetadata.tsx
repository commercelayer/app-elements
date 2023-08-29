import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import { useFormContext } from 'react-hook-form'
import { HookedInput } from './HookedInput'

interface Props {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedInputMetadata({ name }: Props): JSX.Element {
  const { getValues } = useFormContext()

  const metadata = getValues(name)

  if (Object.keys(metadata).length === 0) return <></>

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
