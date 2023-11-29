import {
  OrganizationMenu,
  OrganizationMenuItem
} from '#ui/composite/OrganizationMenu'
import { fireEvent, render } from '@testing-library/react'

describe('OrganizationMenu', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should render the OrganizationMenu', () => {
    const onClick = vi.fn()

    const { container, getByText } = render(
      <OrganizationMenu>
        <OrganizationMenuItem isActive type='home' />
        <OrganizationMenuItem type='apps' onClick={() => onClick('apps')} />
        <OrganizationMenuItem type='resources' />
        <OrganizationMenuItem type='credentials' />
        <OrganizationMenuItem type='team' onClick={() => onClick('team')} />
        <OrganizationMenuItem type='settings' />
      </OrganizationMenu>
    )

    expect(container).toBeVisible()
    expect(getByText('Home')).toBeVisible()
    expect(getByText('Apps')).toBeVisible()
    expect(getByText('Resources')).toBeVisible()
    expect(getByText('API credentials')).toBeVisible()
    expect(getByText('Team')).toBeVisible()
    expect(getByText('Settings')).toBeVisible()

    expect(onClick).not.toHaveBeenCalled()
    fireEvent.click(getByText('Team'))
    expect(onClick).toHaveBeenNthCalledWith(1, 'team')
  })
})
