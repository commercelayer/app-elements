import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { ResourceListItem } from '#ui/resources/ResourceListItem'
import { presetResourceListItem } from '#ui/resources/ResourceListItem/ResourceListItem.mocks'
import { useResourceFilters } from '#ui/resources/useResourceFilters'
import { instructions } from '#ui/resources/useResourceFilters/mockedInstructions'
import { type FiltersInstructions } from '#ui/resources/useResourceFilters/types'
import {
  Description,
  Source,
  Stories,
  Subtitle,
  Title
} from '@storybook/addon-docs'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'

const mockedOrder = presetResourceListItem.orderAwaitingApproval
const navigate = (qs: string): void => {
  alert(`New query string: ${qs}`)
}

const ToggleInstructions: React.FC<{
  instructions: FiltersInstructions
}> = ({ instructions }) => {
  const [show, setShow] = useState(false)
  return (
    <div>
      <p>
        Click on the button below to see a full example of{' '}
        <code>FiltersInstruction</code> array, as it has been defined inside the
        Orders app.
      </p>
      <Button
        onClick={() => {
          setShow(!show)
        }}
      >
        {show ? 'Hide' : 'Show'} FilterInstruction array
      </Button>
      {show && (
        <Source
          dark
          code={JSON.stringify(instructions, null, 2)}
          language='json'
        />
      )}
    </div>
  )
}

/**
 * The `useResourceFilters` hook can be used to render a filterable list of resources. This hook takes as argument an array of instructions of type `FilterInstruction`. Each instruction defines a filter that will be rendered in the form.
 *
 * ### 1. Defining the instructions
 *
 * First, you need to specify an array of instructions that will be used to build the filters. Each instruction has a `label`, `type`, `sdk` and `render` property:
 * - `label` — the field label.
 * - `type`— the type of filter that you need to implement (e.g.: `options`, `timeRange`, or `textSearch`).
 * - `sdk` — an object that contains information to convert the filter value in an SDK filter predicate.
 * - `render` — an object that contains details on which component to use to render the field in the filter form.
 *
 * <span title="Defaults and restricted values" type="info">
 * - Default values can be configured within the instructions by setting `sdk.defaultValue` property in the relative instruction item. In this way that specific filter predicate will be applied by default when no other value is provided.
 * <br />
 * - When the `render` property includes a set of options, it means that the filter only accepts those values. Any other value will be ignored.
 * </span>
 *
 * ### 2. Passing the instructions to the hook
 *
 * Once you have set the instructions array, you can pass it to the `useResourceFilters` hook.
 *
 * <span title="Where to mount the hook" type="info">
 * <br />
 * Usually you want to have the hook in two pages:
 * 1. A page that renders a form to allow the user to configure and interact with the active filters (`<FiltersForm />` component).
 * 1. A page that renders the resource list with the applied filters (`<FilteredList />` component). You can enhance the filtered list with a text search bar and filters navigation buttons (`<SearchWithNav />` component).
 * </span>
 *
 * Active filters state will persist as URL query string.
 * This allows to set filters in a `/filter-form` page and read them from a `/filtered-list` page.
 *
 **/
const setup: Meta = {
  title: 'Resources/useResourceFilters',
  args: {},
  argTypes: {
    children: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      source: {
        type: 'code'
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <ToggleInstructions instructions={instructions} />
          <Stories />
        </>
      )
    }
  }
}
export default setup

/**
 * The example below shows how to render a form based on the instructions provided.
 * <span type="info">
 * The form requires an `onSubmit` prop, that will be used to handle the redirection to the filtered list page
 * with the query string generated from the form values.
 * </span>
 **/
export const FiltersForm: StoryFn = () => {
  const { FiltersForm } = useResourceFilters({
    instructions
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <FiltersForm
          onSubmit={(queryString) => {
            alert(`Redirect to /list?${queryString}`)
          }}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * The example below shows how to render a filtered list of resources based on the current active filters.
 * <span type="info">
 * This component is a wrapper around `ResourceList` where the `query`  prop is auto-filled with the active filters
 * and cannot be overwritten.
 * </span>
 **/
export const FilteredList: StoryFn = () => {
  const { FilteredList } = useResourceFilters({
    instructions
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <FilteredList
          type='orders'
          ItemTemplate={({ resource = mockedOrder, isLoading }) => {
            return (
              <SkeletonTemplate isLoading={isLoading}>
                <ResourceListItem resource={resource} />
              </SkeletonTemplate>
            )
          }}
          query={{}}
          emptyState={<div>empty</div>}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * The example below shows how to render a search bar with filters navigation buttons.
 * <span type="info">
 * While typing in the search bar, a debounced (500ms) `onUpdate` prop is triggered.
 * It can be used to update the query string in the URL with your routing library of choice.
 * Once `window.location.search` has been updated, it triggers a new API request to render a fresh `FilteredList`.
 * </span>
 **/
export const SearchWithNav: StoryFn = () => {
  const { SearchWithNav } = useResourceFilters({
    instructions
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <SearchWithNav
          onFilterClick={(qs, filterPredicate) => {
            alert(`Filter ${filterPredicate ?? ''} button clicked`)
          }}
          onUpdate={(qs) => {
            navigate(`?${qs}`)
          }}
          searchBarPlaceholder='Type to search...'
          queryString='?status_in=placed&status_in=approved&payment_status_eq=authorized&fulfillment_status_in=unfulfilled&timeFrom=2023-09-03T22%3A00%3A00.000Z&timePreset=custom&timeTo=2023-09-05T22%3A00%3A00.000Z'
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * While all the components above — returned from `useResourceFilters` hook — are already connected together,
 * it's still possible to use some helper methods to build your own logic.
 *
 * <span type="info">
 * The `adapters` object returned from the hook contains the following methods:
 * - `adapters.adaptFormValuesToSdk` — converts the form values to SDK filter predicates.
 * - `adapters.adaptFormValuesToUrlQuery` — converts the form values to URL query string.
 * - `adapters.adaptUrlQueryToFormValues` — converts the URL query string to form values.
 * - `adapters.adaptUrlQueryToSdk` — converts the URL query string to SDK filter predicates.
 * - `adapters.adaptUrlQueryToUrlQuery` — parses the URL query string to strip out invalid params (this can be useful if your query string contains params that are not part of the instructions array).
 * - `adapters.validInstructions` — returns the valid instructions array, by stripping out invalid instructions.
 *
 * Have a look at the source code to see how the following object is generated:
 **/
export const FiltersAdapters: StoryFn = () => {
  const { adapters } = useResourceFilters({
    instructions
  })

  const { adaptFormValuesToSdk } = adapters

  const sdkFilters = adaptFormValuesToSdk({
    formValues: {
      status_in: ['placed', 'approved'],
      timePreset: 'last7days'
    },
    timezone: 'Europe/Rome'
  })

  return <pre>{JSON.stringify(sdkFilters, null, 2)}</pre>
}
