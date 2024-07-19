import { MockTokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { fireEvent, render } from '@testing-library/react'
import { HomePageLayout } from './HomePageLayout'

describe('HomePageLayout', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn()
  })
  afterAll(() => {
    vi.clearAllMocks()
  })

  test('Should be rendered', () => {
    const { getByText } = render(
      <HomePageLayout title='My Home page'>
        <div>app content</div>
      </HomePageLayout>
    )
    expect(getByText('app content')).toBeVisible()
  })

  test('Should render a go back to "Apps" button when `isInDashboard` and has `onAppClose`', async () => {
    const mockedOnAppClose = vi.fn()
    const { getByText } = render(
      <MockTokenProvider
        appSlug='orders'
        kind='integration'
        devMode
        isInDashboard
        onAppClose={mockedOnAppClose}
      >
        <HomePageLayout title='My Home page'>
          <div>app content</div>
        </HomePageLayout>
      </MockTokenProvider>
    )

    expect(getByText('Apps')).toBeVisible()
    fireEvent.click(getByText('Apps'))
    expect(mockedOnAppClose).toHaveBeenCalledTimes(1)
  })

  test('Should NOT render the go back  when `isInDashboard` and `onAppClose` is not set', async () => {
    const { queryByText } = render(
      <MockTokenProvider
        appSlug='orders'
        kind='integration'
        devMode
        isInDashboard
      >
        <HomePageLayout title='My Home page'>
          <div>app content</div>
        </HomePageLayout>
      </MockTokenProvider>
    )

    expect(queryByText('Apps')).toBeNull()
  })
})
