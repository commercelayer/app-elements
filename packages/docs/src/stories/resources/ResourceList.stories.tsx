import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import { BlockCode } from '#ui/atoms/BlockCode'
import { Button } from '#ui/atoms/Button'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { InputCheckboxGroup } from '#ui/forms/InputCheckboxGroup'
import { ResourceList } from '#ui/resources/ResourceList'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceList> = {
  title: 'Resources/Resource List',
  component: ResourceList,
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

const Template: StoryFn<typeof ResourceList> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList {...args} type='markets' />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const WithItem = Template.bind({})
WithItem.args = {
  type: 'markets',
  title: 'Markets',
  emptyState: <div>Empty</div>,
  actionButton: <Button variant='link'>Add new</Button>,
  Item: ({ resource = { id: '', name: '' }, isLoading }) => (
    <SkeletonTemplate isLoading={isLoading}>
      <ListItem tag='div' icon={<AvatarLetter text={resource.id} />}>
        {/* @ts-expect-error when passing arguments in the story we cannot get the typed resource (eg. Market). This doesn't happen on normal component usage */}
        {resource?.name}
      </ListItem>
    </SkeletonTemplate>
  )
}

const Pre: React.FC<{ children: string }> = ({ children }) => (
  <pre style={{ display: 'inline-block', background: '#f4f4f4' }}>
    {children}
  </pre>
)

export const AsInputCheckboxGroup = Template.bind({})
AsInputCheckboxGroup.args = {
  type: 'markets',
  emptyState: <div>Empty</div>,
  children: ({ data, isLoading }) => {
    return (
      <div>
        {isLoading || data?.list[0]?.id == null ? (
          <div>loading</div>
        ) : (
          <InputCheckboxGroup
            title='Select items'
            options={data.list.map((market) => ({
              value: market.id,
              // @ts-expect-error when passing arguments in the story we cannot get the typed resource
              content: <div>{market.name}</div>,
              quantity: {
                max: 10,
                min: 1
              }
            }))}
            onChange={() => {}}
          />
        )}
      </div>
    )
  }
}

export const WithFunctionAsChild = Template.bind({})
WithFunctionAsChild.args = {
  type: 'markets',
  emptyState: <div>Empty</div>,
  children: ({ data, isLoading }) => {
    return (
      <div>
        <Spacer bottom='4'>
          <Text size='large'>Markets as json</Text>
        </Spacer>
        <Spacer bottom='4'>
          <Text>
            You can use the following <Pre>`data`</Pre> received as arguments,
            to build own render. A fetch request to get data from the next page,
            will be triggered once the bottom of the component is visible and{' '}
            <Pre>`data`</Pre> object will be updated with new content.
          </Text>
        </Spacer>
        {isLoading || data?.list[0]?.id == null ? (
          <div>loading</div>
        ) : (
          <BlockCode json={data} />
        )}
      </div>
    )
  }
}
