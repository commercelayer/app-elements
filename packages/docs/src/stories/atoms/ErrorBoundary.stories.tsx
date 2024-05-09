import { ErrorBoundary } from '#providers/ErrorBoundary'
import { type Meta, type StoryFn } from '@storybook/react'
import { type FC, useEffect } from 'react'

const setup: Meta<typeof ErrorBoundary> = {
  title: 'Atoms/ErrorBoundary',
  component: ErrorBoundary,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof ErrorBoundary> = (args) => {
  return (
    <ErrorBoundary {...args}>
      <ErrorThrowingComponent />
    </ErrorBoundary>
  )
}

export const Default = Template.bind({})
Default.args = {
  onRetry: () => {
    alert('retry callback called, reset internal state')
  }
}

/**
 * In case of error name is ChunkLoadError it will display a different message to inform the user to refresh the page
 * because the app has been updated.
 */
export const ChunkLoadError: StoryFn = () => {
  return (
    <ErrorBoundary>
      <ErrorThrowingComponent type='ChunkLoadError' />
    </ErrorBoundary>
  )
}

const ErrorThrowingComponent: FC<{ type?: 'ChunkLoadError' }> = ({ type }) => {
  useEffect(() => {
    if (type === 'ChunkLoadError') {
      const error = new Error('Error thrown from component')
      error.name = 'ChunkLoadError'
      throw error
    } else {
      const error = new Error('Error thrown from component')
      error.name = 'GenericError'
      throw error
    }
  }, [type])
  return null
}
