import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Td, Tr } from '#ui/atoms/Table'
import { InputCheckboxGroup } from '#ui/forms/InputCheckboxGroup'
import { ResourceListItem } from '#ui/resources/ResourceListItem'
import { presetResourceListItem } from '#ui/resources/ResourceListItem/ResourceListItem.mocks'
import { useResourceList } from '#ui/resources/useResourceList'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta = {
  title: 'Resources/useResourceList',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  },
  decorators: [
    (Story) => (
      <TokenProvider kind='integration' appSlug='orders' devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    )
  ]
}
export default setup

const mockedOrder = presetResourceListItem.orderAwaitingApproval

export const WithItem: StoryFn = () => {
  const { ResourceList } = useResourceList({
    type: 'orders'
  })

  return (
    <ResourceList
      title='Orders'
      emptyState={<div>Custom empty state component</div>}
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
  )
}

export const WithNoTitle: StoryFn = () => {
  const { ResourceList } = useResourceList({
    type: 'orders'
  })

  return (
    <ResourceList
      actionButton={<Button variant='link'>Add new</Button>}
      ItemTemplate={({ resource = mockedOrder, isLoading }) => {
        return (
          <SkeletonTemplate isLoading={isLoading}>
            <ResourceListItem resource={resource} />
          </SkeletonTemplate>
        )
      }}
    />
  )
}

export const AsTableVariant: StoryFn = () => {
  const { ResourceList } = useResourceList({
    type: 'orders'
  })

  return (
    <ResourceList
      variant='table'
      title='Orders'
      headings={[
        { label: 'NUMBER' },
        { label: 'MARKET' },
        { label: 'TOTAL', align: 'right' }
      ]}
      actionButton={
        <Button variant='secondary' size='mini' alignItems='center'>
          <Icon name='plus' /> Order
        </Button>
      }
      ItemTemplate={({ resource = mockedOrder, isLoading }) => {
        return (
          <Tr>
            <Td isLoading={isLoading}>#{resource.number}</Td>
            <Td isLoading={isLoading}>{resource.market?.name}</Td>
            <Td isLoading={isLoading} align='right'>
              {resource.formatted_total_amount}
            </Td>
          </Tr>
        )
      }}
    />
  )
}

export const AsTableWithEmptyList: StoryFn = () => {
  const { ResourceList } = useResourceList({
    type: 'orders',
    query: {
      filters: {
        market_id_eq: 'not-existing-id'
      }
    }
  })

  return (
    <ResourceList
      title='Orders'
      variant='table'
      headings={[
        { label: 'NUMBER' },
        { label: 'MARKET' },
        { label: 'TOTAL', align: 'right' }
      ]}
      actionButton={
        <Button variant='secondary' size='mini' alignItems='center'>
          <Icon name='plus' /> Order
        </Button>
      }
      ItemTemplate={({ resource = mockedOrder, isLoading }) => {
        return (
          <Tr>
            <Td isLoading={isLoading}>#{resource.number}</Td>
            <Td isLoading={isLoading}>{resource.market?.name}</Td>
            <Td isLoading={isLoading} align='right'>
              {resource.formatted_total_amount}
            </Td>
          </Tr>
        )
      }}
    />
  )
}

export const AsInputCheckboxGroup: StoryFn = () => {
  const { list, isLoading } = useResourceList({
    type: 'markets'
  })

  return (
    <div>
      {isLoading || list == null ? (
        <div>loading</div>
      ) : (
        <InputCheckboxGroup
          title='Select items'
          options={list.map((market) => ({
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
}

/**
 * By default, when the list has multiple pages, the component will show more results using an infinite scrolling.
 */
export const WithInfiniteScrolling: StoryFn = () => {
  const { ResourceList } = useResourceList({
    type: 'orders',
    query: {
      pageSize: 10
    }
  })

  return (
    <ResourceList
      title='Orders'
      emptyState={<div>Empty</div>}
      actionButton={<Button variant='link'>Add new</Button>}
      ItemTemplate={({ resource = mockedOrder, isLoading }) => {
        return (
          <SkeletonTemplate isLoading={isLoading}>
            <ResourceListItem resource={resource} />
          </SkeletonTemplate>
        )
      }}
    />
  )
}
WithInfiniteScrolling.parameters = {
  docs: {
    canvas: {
      // This will remove the "show code" button
      // https://storybook.js.org/docs/api/doc-blocks/doc-block-canvas#sourcestate
      sourceState: 'none'
    }
  }
}
