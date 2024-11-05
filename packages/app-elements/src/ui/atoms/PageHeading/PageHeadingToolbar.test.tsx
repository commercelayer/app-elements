import { act, fireEvent, render, waitFor } from '@testing-library/react'
import {
  PageHeadingToolbar,
  type PageHeadingToolbarProps
} from './PageHeadingToolbar'

const buttons = [
  {
    label: 'Primary',
    size: 'small',
    onClick: () => {
      console.log('Primary')
    }
  },
  {
    label: 'Secondary',
    icon: 'pulse',
    variant: 'secondary',
    size: 'small',
    onClick: () => {
      console.log('Secondary')
    }
  }
] satisfies PageHeadingToolbarProps['buttons']

const dropdownItems = [
  [
    {
      label: 'Edit',
      onClick: () => {
        console.log('Edit')
      }
    },
    {
      label: 'Set metadata',
      onClick: () => {
        console.log('Set metadata')
      }
    }
  ],
  [
    {
      label: 'Delete',
      onClick: () => {
        console.log('Delete')
      }
    }
  ]
] satisfies PageHeadingToolbarProps['dropdownItems']

describe('PageHeadingToolbar', () => {
  it('Should not be rendered', () => {
    const { queryByTestId } = render(<PageHeadingToolbar />)
    expect(queryByTestId('toolbar')).not.toBeInTheDocument()
  })

  it('Should render items', async () => {
    const { queryAllByTestId, queryByTestId, getByText } = render(
      <PageHeadingToolbar buttons={buttons} dropdownItems={dropdownItems} />
    )

    expect(queryAllByTestId('toolbar-button').length).toEqual(2)
    expect(queryAllByTestId('toolbar-dropdown-button').length).toEqual(1)
    expect(queryByTestId('toolbar-dropdown-button')).not.toHaveClass(
      'md:hidden'
    )
    const dropDownButton = queryByTestId('toolbar-dropdown-button')
    if (dropDownButton != null) {
      act(() => {
        fireEvent.click(dropDownButton)
      })
      await waitFor(() => {
        expect(getByText('Edit')).toBeInTheDocument()
        expect(getByText('Set metadata')).toBeInTheDocument()
        expect(getByText('Delete')).toBeInTheDocument()
      })
    }
  })

  it('Should not display the dropdown button when empty', async () => {
    const { queryAllByTestId, queryByTestId } = render(
      <PageHeadingToolbar
        buttons={[
          {
            label: 'Primary',
            size: 'small',
            onClick: () => {
              console.log('Primary')
            }
          }
        ]}
        dropdownItems={[[]]}
      />
    )

    expect(queryAllByTestId('toolbar-button').length).toEqual(1)
    expect(queryAllByTestId('toolbar-dropdown-button').length).toEqual(1)
    expect(queryByTestId('toolbar-dropdown-button')).toHaveClass('md:hidden')
  })
})
