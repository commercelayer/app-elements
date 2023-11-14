import { render } from '@testing-library/react'
import { RemoveButton } from './RemoveButton'

describe('RemoveButton', () => {
  test('Should render', () => {
    const { container, getByTestId } = render(
      <RemoveButton data-testid='removeButton'>Remove item</RemoveButton>
    )

    const removeButton = getByTestId('removeButton')

    expect(container).toBeVisible()
    expect(removeButton).toBeVisible()
    expect(removeButton).toHaveTextContent('Remove item')
    expect(removeButton).toContainHTML('<svg')
  })
})
