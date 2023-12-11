import { Dropdown, DropdownDivider, DropdownItem } from '#ui/composite/Dropdown'
import { fireEvent, render } from '@testing-library/react'

const items = (
  <>
    <DropdownItem onClick={() => {}} icon='creditCard' label='Payments' />
    <DropdownItem
      onClick={() => {}}
      icon='keep-space' // no icon, keep same gap
      label='Items'
    />

    <DropdownDivider />
    <DropdownItem onClick={() => {}} icon='xCircle' label='Delete' />
  </>
)

describe('Dropdown', () => {
  test('Should be rendering with default bottom-right position', () => {
    const { container, getByText } = render(
      <Dropdown dropdownLabel='open dropdown' dropdownItems={items} />
    )
    fireEvent.click(getByText('open dropdown'))
    expect(container).toMatchSnapshot()
  })

  test('Should be rendering bottom-left', () => {
    const { container, getByText } = render(
      <Dropdown
        dropdownLabel='open dropdown'
        menuPosition='bottom-left'
        dropdownItems={<div />}
      />
    )
    fireEvent.click(getByText('open dropdown'))
    expect(container).toMatchSnapshot()
  })

  test('Should be rendering top-left', () => {
    const { container, getByText } = render(
      <Dropdown
        dropdownLabel='open dropdown'
        menuPosition='top-left'
        dropdownItems={<div />}
      />
    )
    fireEvent.click(getByText('open dropdown'))
    expect(container).toMatchSnapshot()
  })

  test('Should be rendering top-right', () => {
    const { container, getByText } = render(
      <Dropdown
        dropdownLabel='open dropdown'
        menuPosition='top-right'
        dropdownItems={<div />}
      />
    )
    fireEvent.click(getByText('open dropdown'))
    expect(container).toMatchSnapshot()
  })
})
