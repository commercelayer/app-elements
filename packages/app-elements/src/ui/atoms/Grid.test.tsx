import { render } from '@testing-library/react'
import { Grid } from './Grid'

describe('Grid', () => {
  test('renders', () => {
    const { container } = render(
      <Grid columns='2'>
        <div>item1</div>
        <div>item2</div>
        <div>item3</div>
        <div>item4</div>
      </Grid>
    )

    expect(container).toBeVisible()
  })
})
