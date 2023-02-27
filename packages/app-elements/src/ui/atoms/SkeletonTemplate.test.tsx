import { render } from '@testing-library/react'
import { A } from './A'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import { Icon } from './Icon'
import { SkeletonTemplate } from './SkeletonTemplate'
import { StatusIcon } from './StatusIcon'
import { Text } from './Text'

describe('SkeletonTemplate', () => {
  test('Should render', () => {
    const { container } = render(
      <SkeletonTemplate>
        <div>Element #1</div>
        <div>Element #2</div>
        <div>Element #3</div>
      </SkeletonTemplate>
    )

    expect(container).toBeVisible()
  })

  test('Should render text elements as "loading items"', () => {
    const { getByText, getByTestId } = render(
      <SkeletonTemplate>
        <div>Element #1</div>
        <A>Element #2</A>
        <Text>Element #3</Text>
        <Button data-test-id='button'>Element #4</Button>
      </SkeletonTemplate>
    )

    expect(getByText('Element #1')).toHaveClass('animate-pulse', 'bg-gray-50')
    expect(getByText('Element #1').nodeName).toEqual('SPAN')

    expect(getByText('Element #2')).toHaveClass('animate-pulse', 'bg-gray-50')
    expect(getByText('Element #2').nodeName).toEqual('SPAN')

    expect(getByText('Element #3')).toHaveClass('animate-pulse', 'bg-gray-50')
    expect(getByText('Element #3').nodeName).toEqual('SPAN')

    expect(getByText('Element #4')).toHaveClass('animate-pulse', 'bg-gray-50')
    expect(getByText('Element #4').nodeName).toEqual('SPAN')

    expect(getByTestId('button')).toHaveClass('animate-pulse', 'bg-gray-50')
  })

  test('Should render <Avatar> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate>
        <Avatar
          data-test-id='element'
          src='data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
          alt='transparent 1px image'
        />
      </SkeletonTemplate>
    )

    expect(getByTestId('element')).toHaveClass('animate-pulse', 'bg-gray-50')
  })

  test('Should render <Badge> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate>
        <Badge data-test-id='element' label='APPROVED' variant='danger' />
      </SkeletonTemplate>
    )

    expect(getByTestId('element')).toHaveClass('animate-pulse', 'bg-gray-50')
  })

  test('Should render <Icon> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate>
        <Icon data-test-id='element' name='arrowLeft' />
      </SkeletonTemplate>
    )

    expect(getByTestId('element')).toHaveClass('animate-pulse', 'bg-gray-50')
  })

  test('Should render <StatusIcon danger> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate>
        <StatusIcon status='danger' />
      </SkeletonTemplate>
    )

    expect(getByTestId('icon-danger')).toHaveClass(
      'animate-pulse',
      'bg-gray-50'
    )
  })

  test('Should render <StatusIcon danger> as "loading item"', () => {
    const { getByTestId } = render(
      <SkeletonTemplate>
        <StatusIcon status='progress' percentage={42} />
      </SkeletonTemplate>
    )

    expect(getByTestId('icon-progress')).toHaveClass(
      'animate-pulse',
      'bg-gray-50'
    )
  })
})
