import { testInvariant } from '#utils/tests'
import { render, RenderResult } from '@testing-library/react'
import { setVerbosity } from 'ts-invariant'
import { StatusIcon, StatusIconProps } from './StatusIcon'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ percentage, status }: StatusIconProps): SetupResult => {
  setVerbosity('silent')
  const utils = render(
    <StatusIcon
      data-test-id='element'
      status={status}
      percentage={percentage}
    />
  )
  const element = utils.getByTestId('element')
  return {
    element,
    ...utils
  }
}

describe('StatusIcon', () => {
  test('Should be rendered', () => {
    const { element } = setup({ status: 'success' })
    expect(element).toBeInTheDocument()
  })

  test('Should throw error if status is not `progress` and percentage is passed', () => {
    testInvariant(() => {
      expect(setup({ status: 'pending', percentage: 40 })).toBeInTheDocument()
    }, 'Percentage needs to be used, and only used, when status is progress')
  })

  test('Should throw error if status is `progress` and percentage is missing', () => {
    testInvariant(() => {
      setup({ status: 'progress' })
    }, 'Percentage needs to be used, and only used, when status is progress')
  })

  test('Should throw error if status is `progress` and percentage is out of range', () => {
    testInvariant(() => {
      setup({ status: 'progress', percentage: 120 })
    }, 'Percentage must be between 0 and 10')
  })

  test('Should be rendered in progress 0%', () => {
    const { element } = setup({ status: 'progress', percentage: 0 })
    expect(element).toBeInTheDocument()
  })
  test('Should be rendered in progress 30%', () => {
    const { element } = setup({ status: 'progress', percentage: 30 })
    expect(element).toBeInTheDocument()
    expect(element.querySelector('svg')).toBeInTheDocument()
    // svg should contain two cirlces
    expect(element.querySelector('svg > circle ~ circle')).toBeInTheDocument()
  })
  test('Should be rendered in progress 100%', () => {
    const { element } = setup({ status: 'progress', percentage: 100 })
    expect(element).toBeInTheDocument()
  })

  test('Should render the `success` status', () => {
    const { element } = setup({ status: 'success' })
    expect(
      element.querySelector('[data-test-id="icon-success"]')
    ).toBeInTheDocument()
  })

  test('Should render the `pending` status', () => {
    const { element } = setup({ status: 'pending' })
    expect(
      element.querySelector('[data-test-id="icon-pending"]')
    ).toBeInTheDocument()
  })

  test('Should render the `danger` status', () => {
    const { element } = setup({ status: 'danger' })
    expect(
      element.querySelector('[data-test-id="icon-danger"]')
    ).toBeInTheDocument()
  })
})
