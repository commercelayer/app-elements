import { render } from '@testing-library/react'
import { Steps } from './Steps'

describe('Steps', () => {
  it('Should be rendered', () => {
    const { container } = render(
      <Steps
        steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('Should render as many `li` as many steps are provided', () => {
    const { getByRole } = render(
      <Steps
        steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]}
      />
    )

    expect(getByRole('list').children.length).toEqual(3)
    expect(getByRole('list').children[0]?.textContent).toEqual('Step 1')
    expect(getByRole('list').children[1]?.textContent).toEqual('Step 2')
    expect(getByRole('list').children[2]?.textContent).toEqual('Step 3')
  })

  it('Should highlight all non "active" steps', () => {
    const { getByText } = render(
      <Steps
        steps={[{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }]}
      />
    )

    expect(getByText('Step 1').previousSibling).toHaveClass('bg-gray-100')
    expect(getByText('Step 2').previousSibling).toHaveClass('bg-gray-100')
    expect(getByText('Step 3').previousSibling).toHaveClass('bg-gray-100')
  })

  it('Should highlight the "active" steps', () => {
    const { getByText } = render(
      <Steps
        steps={[
          { label: 'Step 1', active: true },
          { label: 'Step 2', active: true },
          { label: 'Step 3' }
        ]}
      />
    )

    expect(getByText('Step 1').previousSibling).toHaveClass('bg-primary')
    expect(getByText('Step 1').previousSibling).not.toHaveClass(
      'after:bg-white'
    )
    expect(getByText('Step 2').previousSibling).toHaveClass(
      'bg-primary after:bg-white'
    )
    expect(getByText('Step 3').previousSibling).toHaveClass('bg-gray-100')
    expect(getByText('Step 3').previousSibling).not.toHaveClass(
      'after:bg-white'
    )
  })

  it('Should mark as "active" all previous step from the latest "active"', () => {
    const { getByText } = render(
      <Steps
        steps={[
          { label: 'Step 1' },
          { label: 'Step 2', active: true },
          { label: 'Step 3' }
        ]}
      />
    )

    expect(getByText('Step 1').previousSibling).toHaveClass('bg-primary')
    expect(getByText('Step 1').previousSibling).not.toHaveClass(
      'after:bg-white'
    )
    expect(getByText('Step 2').previousSibling).toHaveClass(
      'bg-primary after:bg-white'
    )
    expect(getByText('Step 3').previousSibling).toHaveClass('bg-gray-100')
    expect(getByText('Step 3').previousSibling).not.toHaveClass(
      'after:bg-white'
    )
  })
})
