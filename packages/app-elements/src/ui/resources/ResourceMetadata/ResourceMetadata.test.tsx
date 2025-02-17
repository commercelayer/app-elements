import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { act, render, type RenderResult } from '@testing-library/react'
import { ResourceMetadata } from './ResourceMetadata'

const setup = async (): Promise<RenderResult> => {
  return await act(async () =>
    render(
      <TokenProvider kind='integration' appSlug='customers' devMode>
        <CoreSdkProvider>
          <ResourceMetadata
            resourceType='customers'
            resourceId='NMWYhbGorj'
            overlay={{ title: 'customer@tk.com' }}
          />
        </CoreSdkProvider>
      </TokenProvider>
    )
  )
}

describe('ResourceMetadata', () => {
  it('should render object entries with string values', async () => {
    const { queryByTestId } = await setup()

    expect(queryByTestId('ResourceMetadata-item-first_name')).toBeVisible()
    expect(
      queryByTestId('ResourceMetadata-value-first_name')?.innerHTML
    ).toContain('John')
    expect(queryByTestId('ResourceMetadata-item-last_name')).toBeVisible()
    expect(
      queryByTestId('ResourceMetadata-value-last_name')?.innerHTML
    ).toContain('Doe')
  })

  it('should not render  of object entries with non string values', async () => {
    const { queryByTestId } = await setup()

    expect(
      queryByTestId('ResourceMetadata-item-gdpr_preferences')
    ).not.toBeInTheDocument()
  })
})
