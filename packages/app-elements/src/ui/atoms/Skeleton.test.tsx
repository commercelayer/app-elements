import { Skeleton, SkeletonItem } from './Skeleton'
import { render, type RenderResult } from '@testing-library/react'

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

describe('SkeletonItems', () => {
  test('Should be rendered', () => {
    const { getByTestId } = render(
      <SkeletonItem data-test-id='skeleton-item' type='box' />
    )
    expect(getByTestId('skeleton-item')).toBeInTheDocument()
  })

  test('Should rendered with default width and height', () => {
    const { getByTestId } = render(
      <SkeletonItem data-test-id='skeleton-item' type='circle' />
    )
    const element = getByTestId('skeleton-item')
    const computedStyle = getComputedStyle(element)
    expect(computedStyle.width).toBe('100%')
    expect(computedStyle.height).toBe('1em')
  })

  test('Should rendered with custom width and height', () => {
    const { getByTestId } = render(
      <SkeletonItem data-test-id='skeleton-item' width='50px' height='4vh' />
    )
    const element = getByTestId('skeleton-item')
    const computedStyle = getComputedStyle(element)
    expect(computedStyle.width).toBe('50px')
    expect(computedStyle.height).toBe('4vh')
  })

  test('Should ignore default width and height when className is passed', () => {
    const { getByTestId } = render(
      <SkeletonItem data-test-id='skeleton-item' className='custom-css' />
    )
    const element = getByTestId('skeleton-item')
    const computedStyle = getComputedStyle(element)
    expect(computedStyle.width).toBe('')
    expect(computedStyle.height).toBe('')
  })
})
