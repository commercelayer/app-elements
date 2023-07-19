import { type Metadata } from '@commercelayer/sdk/lib/cjs/resource'
import { render } from '@testing-library/react'
import { ListItemsMetadata } from './ListItemsMetadata'

const metadata: Metadata = {
  name: 'Michael',
  surname: 'Jordan',
  country: 'U.S.A.',
  age: 60,
  specs: { teams: ['Chicago Bulls', 'Washington Wizards'] }
}

describe('ListItemsMetadata', () => {
  it('should render ListItems of object entries with string values', () => {
    const { queryByTestId } = render(<ListItemsMetadata metadata={metadata} />)

    expect(queryByTestId('ListItemsMetadata-item-name')).toBeVisible()
    expect(queryByTestId('ListItemsMetadata-value-name')?.innerHTML).toContain(
      'Michael'
    )
    expect(queryByTestId('ListItemsMetadata-item-surname')).toBeVisible()
    expect(
      queryByTestId('ListItemsMetadata-value-surname')?.innerHTML
    ).toContain('Jordan')
    expect(queryByTestId('ListItemsMetadata-item-country')).toBeVisible()
    expect(
      queryByTestId('ListItemsMetadata-value-country')?.innerHTML
    ).toContain('U.S.A.')
  })

  it('should not render ListItems of object entries with non string values', () => {
    const { queryByTestId } = render(<ListItemsMetadata metadata={metadata} />)
    expect(queryByTestId('ListItemsMetadata-item-age')).toBeNull()
    expect(queryByTestId('ListItemsMetadata-item-specs')).toBeNull()
  })
})
