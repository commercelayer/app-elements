import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { InputCheckboxGroup } from '#ui/forms/InputCheckboxGroup'
import { ResourceList } from '#ui/resources/ResourceList'
import { ResourceListItem } from '#ui/resources/ResourceListItem'
import { presetResourceListItem } from '#ui/resources/ResourceListItem/ResourceListItem.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof ResourceList> = {
  title: 'Resources/ResourceList',
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

const mockedOrder = presetResourceListItem.orderAwaitingApproval

export const WithItem: StoryFn<typeof ResourceList> = () => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList
          title='Orders'
          emptyState={<div>Empty</div>}
          type='orders'
          actionButton={<Button variant='link'>Add new</Button>}
          ItemTemplate={({ resource = mockedOrder, isLoading }) => {
            return (
              <SkeletonTemplate isLoading={isLoading}>
                <ResourceListItem
                  resource={resource}
                  onClick={() => {
                    console.log('click')
                  }}
                />
              </SkeletonTemplate>
            )
          }}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const WithNoTitle: StoryFn<typeof ResourceList> = () => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList
          title={undefined}
          emptyState={<div>Empty</div>}
          type='orders'
          ItemTemplate={({ resource = mockedOrder, isLoading }) => {
            return (
              <SkeletonTemplate isLoading={isLoading}>
                <ResourceListItem resource={resource} />
              </SkeletonTemplate>
            )
          }}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const AsInputCheckboxGroup: StoryFn<typeof ResourceList> = (args) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList type='markets' emptyState={<div>Empty</div>}>
          {({ data, isLoading }) => {
            return (
              <div>
                {isLoading || data?.list[0]?.id == null ? (
                  <div>loading</div>
                ) : (
                  <InputCheckboxGroup
                    title='Select items'
                    options={data.list.map((market) => ({
                      value: market.id,
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
          }}
        </ResourceList>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const WithFunctionAsChild = (): JSX.Element => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList type='markets' emptyState={<div>Empty</div>}>
          {({ data, isLoading }) => {
            return (
              <div>
                <Spacer bottom='4'>
                  <Text size='large'>Markets as json</Text>
                </Spacer>
                <Spacer bottom='4'>
                  <Text>
                    You can use the following <Pre>`data`</Pre> received as
                    arguments, to build own render. A fetch request to get data
                    from the next page, will be triggered once the bottom of the
                    component is visible and <Pre>`data`</Pre> object will be
                    updated with new content.
                  </Text>
                </Spacer>
                {isLoading || data?.list[0]?.id == null ? (
                  <div>loading</div>
                ) : (
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                )}
              </div>
            )
          }}
        </ResourceList>
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * By default, when the list has multiple pages, the component will show more results using an infinite scrolling.
 */
export const WithInfiniteScrolling: StoryFn<typeof ResourceList> = () => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <ResourceList
          title='Orders'
          type='orders'
          emptyState={<div>Empty</div>}
          ItemTemplate={({ resource = mockedOrder, isLoading }) => {
            return (
              <SkeletonTemplate isLoading={isLoading}>
                <ResourceListItem resource={resource} />
              </SkeletonTemplate>
            )
          }}
          query={{
            pageSize: 10
          }}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}
WithInfiniteScrolling.parameters = {
  docs: {
    source: {
      code: null
    }
  }
}

const Pre: React.FC<{ children: string }> = ({ children }) => (
  <pre style={{ display: 'inline-block', background: '#f4f4f4' }}>
    {children}
  </pre>
)
