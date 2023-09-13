import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Button } from '#ui/atoms/Button'
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
 * This sections shows how to configure `useFilters` hook to render a filtrable list of resources.
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
 * Active filters state will persist as url query string.
 * This will allow to set filters in a `/filter-form` page and after read them from `/filtered-list/` page
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
 * Renders a form based on the instructions provided.
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
 * Renders a list filtered on the base of the current active filters
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
          ItemTemplate={() => <div>foo</div>}
          emptyState={<div>empty</div>}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * Renders a search bar with filters navigation on the bottom.
 * While typing in the search bar, the current query string will be updated to include the text search filter.
 * This will render e fresh `FilteredList`
 **/
export const SearchWithNav: StoryFn = () => {
  const { SearchWithNav } = useResourceFilters({
    instructions
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <SearchWithNav
          onFilterClick={() => {}}
          onUpdate={() => {}}
          queryString='?status_in=placed&status_in=approved&timeFrom=2023-09-03T22%3A00%3A00.000Z&timePreset=custom&timeTo=2023-09-05T22%3A00%3A00.000Z'
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

/**
 * Renders a search bar with filters navigation on the bottom.
 * While typing in the search bar, the current query string will be updated to include the text search filter.
 * This will render e fresh `FilteredList`
 **/
export const FiltersAdapters: StoryFn = () => {
  const { adapters } = useResourceFilters({
    instructions
  })

  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <pre>{JSON.stringify(adapters.adaptFormValuesToSdk, null, 2)}</pre>
      </CoreSdkProvider>
    </TokenProvider>
  )
}
