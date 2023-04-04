import { render } from '@testing-library/react'
import { RadialProgress } from './RadialProgress'
import { expect } from 'vitest'

function getFilledPercentage(circle: HTMLElement): number {
  const circumference = circle.getAttribute('stroke-dasharray')
  const filledPart = circle.getAttribute('stroke-dashoffset')
  return 100 - Math.round((Number(filledPart) * 100) / Number(circumference))
}

describe('RadialProgress', () => {
  test('Should be rendered as pending', () => {
    const { queryByTestId } = render(<RadialProgress percentage={undefined} />)
    expect(queryByTestId('radial-progress-pending')).toBeInTheDocument()
    expect(queryByTestId('radial-progress-percentage')).not.toBeInTheDocument()
  })

  test('Should be rendered in progress 0%', () => {
    const { getByTestId, queryByTestId } = render(
      <RadialProgress percentage={0} />
    )
    const circle = getByTestId('radial-progress-percentage')
    expect(queryByTestId('radial-progress-pending')).not.toBeInTheDocument()
    expect(getFilledPercentage(circle)).toBe(0)
  })

  test('Should be rendered in progress 30%', () => {
    const { getByTestId } = render(<RadialProgress percentage={30} />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(30)
  })

  test('Should be rendered in progress 50%', () => {
    const { getByTestId } = render(<RadialProgress percentage={50} />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(50)
  })

  test('Should be rendered in progress 100%', () => {
    const { getByTestId } = render(<RadialProgress percentage={100} />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(100)
  })

  test('Should parse out of range percentage as 100%', () => {
    const { getByTestId } = render(<RadialProgress percentage={110} />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(100)
  })

  test('Should parse negative value as 0%', () => {
    const { getByTestId } = render(<RadialProgress percentage={-30} />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(0)
  })

  test('Should ignore NaN values', () => {
    const { getByTestId } = render(<RadialProgress percentage={NaN} />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(0)
  })

  test('Should ignore string values', () => {
    // @ts-expect-error I want to test with a wrong value.
    const { getByTestId } = render(<RadialProgress percentage='asd' />)
    const circle = getByTestId('radial-progress-percentage')
    expect(getFilledPercentage(circle)).toBe(0)
  })
})
