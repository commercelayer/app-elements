import { Skeleton, SkeletonItem } from './Skeleton'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(
    <Skeleton data-test-id='my-loading-skeleton'>
      <SkeletonItem data-test-id='skeleton-item-box' type='box' />
      <SkeletonItem data-test-id='skeleton-item-circle' type='circle' />
    </Skeleton>
  )
  const element = utils.getByTestId('my-loading-skeleton')
  return {
    element,
    ...utils
  }
}

describe('Skeleton with SkeletonItems', () => {
  test('Should be rendered', () => {
    const { element, getByTestId } = setup()
    expect(element).toBeVisible()
    expect(element).toHaveClass('animate-pulse')
    expect(getByTestId('skeleton-item-box')).toHaveClass('rounded')
    expect(getByTestId('skeleton-item-circle')).toHaveClass('rounded-full')
  })
})
