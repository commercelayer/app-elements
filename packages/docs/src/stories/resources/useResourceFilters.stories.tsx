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
      <Button
        onClick={() => {
          setShow(!show)
        }}
      >
        {show ? 'Hide' : 'Show'} instructions array
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
 * This sections shows how to configure `useResourceFilters` hook to render a filtrable list of resources.
 *
 * The hook takes as argument an array of instructions of type `FilterInstruction`.
 * Each instruction defines a filter that will be rendered in the form.
 *
 * The first step is to define an array of instructions to build our filters.
 *
 * Each instruction has a `label`, `type`, `sdk` and `render` property.
 * - `label` is the label that will be used for that field.
 * - `type` is the type of filter that we need (examples: 'options', 'timeRange' or 'textSearch').
 * - `sdk` is an object that contains information to convert the filter value in sdk filter predicate.
 * - `render` is an object that contains details on which component to use to render the field in the filter form.
 *
 * Once we have our instructions array, we can pass it to the `useResourceFilters` hook.
 *
 * <span type="info">
 * Usually you want to have two pages:
 * - a first page where you render a form with the filters
 * - a second page where you render the list with the applied filters
 * </span>
 *
 * Active filters state will persist as url query string.
 * This allows to set filters in a `/filter-form` page and read them from a `/filtered-list` page.
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
 * How to render a form based on the instructions provided.
 * <span type="info">
 * The form requires an `onSubmit` props, that will be used to handle the redirection to the filtered list page
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
 * How to render a list of resources filtered on the base of the current active filters.
 * <span type="info">
 * This component is a wrapper around `ResourceList` where `query`  props is auto-filled with the active filters
 * and can't be overwritten.
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
          emptyState={<div>empty</div>}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * How to render a search bar with filters navigation buttons.
 * <span type="info">
 * While typing in the search bar, a debounced (500ms) `onUpdate` props will be triggered.
 * It can be used to update the query string in the url with your own routing library.
 * Once `window.location.search` has been updated, it will trigger a new API request that
 * will render a fresh `FilteredList`.
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
          queryString='?status_in=placed&status_in=approved&timeFrom=2023-09-03T22%3A00%3A00.000Z&timePreset=custom&timeTo=2023-09-05T22%3A00%3A00.000Z'
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * While all components above, returned from `useResourceFilters` hook, are already connected together,
 * it's still possible to use some helper methods to build your own logic.
 *
 * <span type="info">
 * The `adapters` object returned from the hook contains the following methods:
 * - `adapters.adaptFormValuesToSdk`: converts the form values to sdk filter predicates
 * - `adapters.adaptFormValuesToUrlQuery`: converts the form values to url query string
 * - `adapters.adaptUrlQueryToFormValues`: converts the url query string to form values
 * - `adapters.adaptUrlQueryToSdk`: converts the url query string to sdk filter predicates
 * - `adapters.adaptUrlQueryToUrlQuery`: parse the url query string to url query string by stripping out invalid params. This can be useful if your query string contains params that are not part of the instructions array.
 * - `adapters.validInstructions`: returns the valid instructions array, by stripping out invalid instructions.
 * </span>
 *
 * <span type="warning">View source code to see how the following object is generated:</span>
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
