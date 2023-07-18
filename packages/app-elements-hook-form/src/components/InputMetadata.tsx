import { ListItem, Text } from '@commercelayer/app-elements'
import { useFormContext } from 'react-hook-form'
import { Input } from './Input'

interface Props {
  /**
   * field name to match hook-form state
   */
  name: string
}

function InputMetadata({ name }: Props): JSX.Element {
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
            <Input name={`${name}.${metadataKey}`} />
          </ListItem>
        )
      })}
    </>
  )
}

InputMetadata.displayName = 'InputMetadata'
export { InputMetadata }
