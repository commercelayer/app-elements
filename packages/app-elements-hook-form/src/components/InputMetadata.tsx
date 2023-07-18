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
      {Object.keys(metadata).map((key) => {
        if (typeof metadata[key] !== 'string') return <></>

        return (
          <ListItem tag='div' key={key}>
            <Text variant='info' className='capitalize'>
              {key}
            </Text>
            <Input name={`${name}.${key}`} />
          </ListItem>
        )
      })}
    </>
  )
}

InputMetadata.displayName = 'InputMetadata'
export { InputMetadata }
