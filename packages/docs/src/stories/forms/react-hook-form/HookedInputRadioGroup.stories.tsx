import { Avatar } from '#ui/atoms/Avatar'
import { Button } from '#ui/atoms/Button'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { HookedForm } from '#ui/forms/Form'
import { HookedInputRadioGroup } from '#ui/forms/InputRadioGroup'
import { type Meta, type StoryFn } from '@storybook/react'
import { useForm } from 'react-hook-form'

const setup: Meta<typeof HookedInputRadioGroup> = {
  title: 'Forms/react-hook-form/HookedInputRadioGroup',
  component: HookedInputRadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}
export default setup

const Template: StoryFn<typeof HookedInputRadioGroup> = (args) => {
  const methods = useForm({
    defaultValues: {
      carrier: 'Fedex'
    }
  })

  return (
    <HookedForm
      {...methods}
      onSubmit={(values) => {
        alert(JSON.stringify(values))
      }}
    >
      <HookedInputRadioGroup {...args} />
      <Spacer top='4'>
        <Button type='submit'>Submit</Button>
      </Spacer>
    </HookedForm>
  )
}

export const Default = Template.bind({})
Default.args = {
  title: 'Select a Rate',
  name: 'carrier',
  options: [
    {
      value: 'DHL1',
      content: (
        <ListItem
          tag='div'
          alignItems='top'
          alignIcon='center'
          borderStyle='none'
          padding='none'
          icon={
            <Avatar
              size='small'
              shape='circle'
              border='none'
              src='carriers:dhl'
              alt='DHL'
            />
          }
        >
          <div>
            <Text size='regular' weight='bold'>
              Domestic Express · 48h
            </Text>
            <Text size='small' tag='div' variant='info' weight='medium'>
              DHL Express
            </Text>
          </div>
          <Text size='regular' weight='bold' wrap='nowrap'>
            €7,41
          </Text>
        </ListItem>
      )
    },
    {
      value: 'Fedex',
      content: (
        <ListItem
          tag='div'
          alignItems='top'
          alignIcon='center'
          borderStyle='none'
          padding='none'
          icon={
            <Avatar
              size='small'
              shape='circle'
              border='none'
              src='carriers:fedex'
              alt='Fedex'
            />
          }
        >
          <div>
            <Text size='regular' weight='bold'>
              Express Pro · 48h
            </Text>
            <Text size='small' tag='div' variant='info' weight='medium'>
              Fedex
            </Text>
          </div>
          <Text size='regular' weight='bold' wrap='nowrap'>
            $12,00
          </Text>
        </ListItem>
      )
    },
    {
      value: 'DHL2',
      content: (
        <ListItem
          tag='div'
          alignItems='top'
          alignIcon='center'
          borderStyle='none'
          padding='none'
          icon={
            <Avatar
              size='small'
              shape='circle'
              border='none'
              src='carriers:dhl'
              alt='DHL'
            />
          }
        >
          <div>
            <Text size='regular' weight='bold'>
              Domestic Express 1200 · 24h
            </Text>
            <Text size='small' tag='div' variant='info' weight='medium'>
              DHL Express
            </Text>
          </div>
          <Text size='regular' weight='bold' wrap='nowrap'>
            €37,61
          </Text>
        </ListItem>
      )
    }
  ]
}
