import { Avatar } from '#ui/atoms/Avatar'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { InputRadioGroup } from '#ui/forms/InputRadioGroup'
import {
  ArgsTable,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title
} from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof InputRadioGroup> = {
  title: 'Forms/ui/InputRadioGroup',
  component: InputRadioGroup,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable story='Default' />
          <Stories includePrimary={false} />
        </>
      )
    }
  }
}
export default setup

const Template: StoryFn<typeof InputRadioGroup> = (args) => {
  return <InputRadioGroup {...args} />
}

export const Default = Template.bind({})
Default.args = {
  title: 'Select a Rate',
  name: 'carrier',
  onChange: (v) => {
    console.log(v)
  },
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

export const ViewModeInline = Template.bind({})
ViewModeInline.args = {
  title: 'Choose a box',
  name: 'package',
  viewMode: 'inline',
  showInput: false,
  onChange: (v) => {
    console.log(v)
  },
  options: [
    {
      value: 'medium',
      content: (
        <>
          <Spacer bottom='2'>
            <Text size='regular' weight='bold'>
              Medium box
            </Text>
          </Spacer>
          <Text size='small' tag='div' variant='info' weight='medium'>
            20 × 30 × 40 cm
          </Text>
        </>
      )
    },
    {
      value: 'large',
      content: (
        <>
          <Spacer bottom='2'>
            <Text size='regular' weight='bold'>
              Large box
            </Text>
          </Spacer>
          <Text size='small' tag='div' variant='info' weight='medium'>
            40 × 60 × 80 cm
          </Text>
        </>
      )
    }
  ]
}

export const DefaultValue = Template.bind({})
DefaultValue.args = {
  name: 'package',
  viewMode: 'inline',
  showInput: false,
  defaultValue: 'large',
  options: [
    {
      value: 'medium',
      content: (
        <>
          <Spacer bottom='2'>
            <Text size='regular' weight='bold'>
              Medium box
            </Text>
          </Spacer>
          <Text size='small' tag='div' variant='info' weight='medium'>
            20 × 30 × 40 cm
          </Text>
        </>
      )
    },
    {
      value: 'large',
      content: (
        <>
          <Spacer bottom='2'>
            <Text size='regular' weight='bold'>
              Large box
            </Text>
          </Spacer>
          <Text size='small' tag='div' variant='info' weight='medium'>
            40 × 60 × 80 cm
          </Text>
        </>
      )
    }
  ]
}
