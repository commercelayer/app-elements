import { Text } from '#app-elements/atoms/Text'
import { List } from '#app-elements/lists/List'
import { ListItemFlex } from '#app-elements/lists/ListItemFlex'
import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof ListItemFlex> = {
  title: 'Lists/ListItemFlex',
  component: ListItemFlex,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof ListItemFlex> = (args) => (
  <ListItemFlex {...args}>
    <div>
      <Text tag='div' weight='semibold'>
        NY Store #19346524
      </Text>
      <Text tag='div' weight='medium' size='small' variant='info'>
        Placed · mjordan@nba.com · May 17
      </Text>
      <Text tag='div' weight='bold' size='small' variant='orange'>
        Awaiting approval
      </Text>
    </div>
    <div>
      <Text tag='div' weight='semibold'>
        $42.55
      </Text>
      <Text tag='div' weight='medium' size='small' variant='info'>
        Authorized
      </Text>
    </div>
  </ListItemFlex>
)

export const Simple = Template.bind({})
Simple.args = {
  onClick: () => undefined
}

export const WithPresetIcon = Template.bind({})
WithPresetIcon.args = {
  onClick: () => undefined,
  icon: {
    name: 'arrowDown',
    background: 'orange'
  }
}

export const WithCustomIcon = Template.bind({})
WithCustomIcon.args = {
  onClick: () => undefined,
  icon: (
    <div>
      <img src='https://via.placeholder.com/42' width={42} />
    </div>
  )
}

const TemplateFullList: ComponentStory<typeof ListItemFlex> = (args) => (
  <List title='Results · 13,765'>
    <ListItemFlex
      icon={{
        name: 'arrowDown',
        background: 'orange'
      }}
    >
      <div>
        <Text tag='div' weight='semibold'>
          NY Store #19346524
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          Placed · mjordan@nba.com · May 17
        </Text>
        <Text tag='div' weight='bold' size='small' variant='orange'>
          Awaiting approval
        </Text>
      </div>
      <div>
        <Text tag='div' weight='semibold'>
          $42.55
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          Authorized
        </Text>
      </div>
    </ListItemFlex>

    <ListItemFlex
      icon={{
        name: 'x',
        background: 'gray'
      }}
    >
      <div>
        <Text tag='div' weight='semibold'>
          US online #19346523
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          Cancelled · mjordan@nba.com · May 17
        </Text>
      </div>
      <div>
        <Text tag='div' weight='semibold'>
          $23.00
        </Text>
        <Text tag='div' weight='medium' size='small' variant='info'>
          Voided
        </Text>
      </div>
    </ListItemFlex>
  </List>
)

export const FullList = TemplateFullList.bind({})
FullList.args = {}
