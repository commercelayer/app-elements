import { ListTaskItem, ListTaskItemProps } from './ListTaskItem'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListTaskItemProps): SetupResult => {
  const utils = render(<ListTaskItem data-test-id='my-task-item' {...props} />)
  const element = utils.getByTestId('my-task-item')
  return {
    element,
    ...utils
  }
}

describe('ListTaskItem', () => {
  test('Should be rendered', () => {
    const { element, getByTestId } = setup({
      status: 'success',
      title: 'Import number #1',
      onClick: () => undefined
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('list-task-item-title')).toBeInTheDocument()
    expect(
      element.querySelector("[data-test-id='list-task-item-description']")
    ).not.toBeInTheDocument()
    expect(getByTestId('list-task-item-btn-view')).toBeInTheDocument()
  })

  test('Should be render a description', () => {
    const { element, getByTestId } = setup({
      status: 'danger',
      title: 'Import number #2',
      description: <div>This is a description</div>,
      onClick: () => undefined
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('list-task-item-title')).toBeInTheDocument()
    expect(getByTestId('list-task-item-description')).toBeInTheDocument()
    expect(getByTestId('list-task-item-btn-view')).toBeInTheDocument()
  })

  test('Should show the cancel button', () => {
    const { element, getByTestId } = setup({
      status: 'danger',
      title: 'Import number #2',
      onClick: () => undefined,
      onCancelRequest: () => undefined
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('list-task-item-title')).toBeInTheDocument()
    expect(getByTestId('list-task-item-btn-cancel')).toBeInTheDocument()
    expect(
      element.querySelector("[data-test-id='list-task-item-btn-view']")
    ).not.toBeInTheDocument()
  })
})
