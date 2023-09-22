/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { type Return } from '@commercelayer/sdk'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { vi } from 'vitest'
import { ResourceReturnSummary } from './ResourceReturnSummary'

const resource: Return = {
  type: 'returns',
  id: '',
  created_at: '',
  updated_at: '',

  status: 'requested',

  return_line_items: [
    {
      type: 'return_line_items',
      id: '1',
      created_at: '',
      updated_at: '',
      sku_code: 'BABYBIBXA19D9D000000XXXX',
      image_url:
        'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png',
      name: 'Gray Baby Bib with Black Logo',
      quantity: 2
    },
    {
      type: 'return_line_items',
      id: '2',
      created_at: '',
      updated_at: '',
      sku_code: 'BABYBIBXA19D9D000000XXXX',
      image_url:
        'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BABYBIBXA19D9D000000XXXX_FLAT.png',
      name: 'Gray Baby Bib with Black Logo',
      quantity: 2
    }
  ]
}

describe('ResourceReturnSummary', () => {
  it('should show return_line_items', async () => {
    const { queryAllByText } = render(
      <ResourceReturnSummary resource={resource} />
    )
    await waitFor(() => {
      expect(queryAllByText('Gray Baby Bib with Black Logo').length).toEqual(2)
    })
  })

  it('should not render the action buttons when not defined', async () => {
    const { queryByTestId } = await act(async () =>
      render(<ResourceReturnSummary resource={resource} />)
    )

    expect(queryByTestId('action-buttons')).not.toBeInTheDocument()
  })

  it('should render the action buttons when defined', async () => {
    const mockedConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    const { getByText, getByTestId } = await act(async () =>
      render(
        <ResourceReturnSummary
          resource={resource}
          footerActions={[
            {
              label: 'Approve',
              onClick: () => {
                console.log('approved!')
              }
            },
            {
              label: 'Cancel',
              variant: 'secondary',
              onClick: () => {
                console.log('cancelled!')
              }
            }
          ]}
        />
      )
    )

    const actionContainer = getByTestId('action-buttons')
    expect(actionContainer).toBeInTheDocument()

    expect(actionContainer.children[0]).toHaveClass('md:basis-1/2 flex gap-3')
    expect(actionContainer.children[1]).toHaveClass(
      'md:basis-1/2 flex gap-3 justify-end'
    )

    const approveButton = getByText('Approve')
    const cancelButton = getByText('Cancel')

    expect(mockedConsoleLog).not.toHaveBeenCalled()

    expect(approveButton).toBeInTheDocument()
    expect(approveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(approveButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('approved!')

    expect(cancelButton).toBeInTheDocument()
    expect(cancelButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(cancelButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('cancelled!')
  })

  it('should render a full-width button when there is only one primary action', async () => {
    const mockedConsoleLog = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {})
    const { getByText, getByTestId } = await act(async () =>
      render(
        <ResourceReturnSummary
          resource={resource}
          footerActions={[
            {
              label: 'Approve',
              onClick: () => {
                console.log('approved!')
              }
            }
          ]}
        />
      )
    )

    const actionContainer = getByTestId('action-buttons')
    expect(actionContainer).toBeInTheDocument()

    expect(actionContainer.children[0]).not.toHaveClass(
      'md:basis-1/2 flex gap-3'
    )

    const approveButton = getByText('Approve')

    expect(approveButton).toBeInTheDocument()
    expect(approveButton.tagName).toEqual('BUTTON')
    await act(() => fireEvent.click(approveButton))
    expect(mockedConsoleLog).toHaveBeenCalledWith('approved!')
  })
})
