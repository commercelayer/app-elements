import { render } from '@testing-library/react'
import { A } from './A'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import { Icon } from './Icon'
import { SkeletonTemplate } from './SkeletonTemplate'
import { RadialProgress } from './RadialProgress'
import { Text } from './Text'

describe('SkeletonTemplate', () => {
  test('Should render', () => {
    const { container } = render(
      <SkeletonTemplate isLoading>
        <div>Element #1</div>
        <div>Element #2</div>
        <div>Element #3</div>
      </SkeletonTemplate>
    )

    expect(container).toBeVisible()
  })

  test('Should render text elements as "loading items"', () => {
    const { getByText, getByTestId } = render(
      <SkeletonTemplate isLoading>
        <div>Element #1</div>
        <A>Element #2</A>
        <Text>Element #3</Text>
        <Button data-test-id='button'>Element #4</Button>
      </SkeletonTemplate>
    )

    expect(getByText('Element #1')).toHaveClass('animate-pulse', '!bg-gray-50')
    expect(getByText('Element #1').nodeName).toEqual('SPAN')

    expect(getByText('Element #2')).toHaveClass('animate-pulse', '!bg-gray-50')
    expect(getByText('Element #2').nodeName).toEqual('SPAN')

    expect(getByText('Element #3')).toHaveClass('animate-pulse', '!bg-gray-50')
    expect(getByText('Element #3').nodeName).toEqual('SPAN')

    expect(getByText('Element #4')).toHaveClass('animate-pulse', '!bg-gray-50')
    expect(getByText('Element #4').nodeName).toEqual('SPAN')

    expect(getByTestId('button')).toHaveClass('animate-pulse', '!bg-gray-50')
  })

  test('Should render <Avatar> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <Avatar
          data-test-id='element'
          src='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
          alt='transparent 1px image'
        />
      </SkeletonTemplate>
    )

    expect(getByTestId('element')).toHaveClass('animate-pulse', '!bg-gray-50')
  })

  test('Should render <Badge> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <Badge data-test-id='element' label='APPROVED' variant='danger' />
      </SkeletonTemplate>
    )

    expect(getByTestId('element')).toHaveClass('animate-pulse', '!bg-gray-50')
  })

  test('Should render <Icon> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <Icon data-test-id='element' name='arrowLeft' />
      </SkeletonTemplate>
    )

    expect(getByTestId('element')).toHaveClass('animate-pulse', '!bg-gray-50')
  })

  test('Should render RadialProgress as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <RadialProgress />
      </SkeletonTemplate>
    )

    expect(getByTestId('radial-progress')).toHaveClass(
      'animate-pulse',
      '!bg-gray-50'
    )
  })

  test('Should render <RadialProgress percentage> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate isLoading>
        <RadialProgress percentage={42} />
      </SkeletonTemplate>
    )

    expect(getByTestId('radial-progress')).toHaveClass(
      'animate-pulse',
      '!bg-gray-50'
    )
  })
})
