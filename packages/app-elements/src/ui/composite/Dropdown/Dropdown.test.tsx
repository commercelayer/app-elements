import { Button } from '#ui/atoms/Button'
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
  test('Should use the provided Button when `dropdownLabel` is set to Button', () => {
    const { container, getByText, getAllByRole } = render(
      <Dropdown
        dropdownLabel={<Button>Open dropdown</Button>}
        dropdownItems={items}
      />
    )

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="relative"
        >
          <button
            aria-expanded="false"
            aria-haspopup="true"
            class="rounded whitespace-nowrap leading-5 inline-block text-center transition-opacity duration-500 px-6 py-3 text-base font-bold bg-black border border-black text-white hover:opacity-80"
          >
            Open dropdown
          </button>
        </div>
      </div>
    `)

    const button = getByText('Open dropdown')
    expect(button).not.toHaveClass('m-0 p-0 align-top')

    expect(getAllByRole('button').length).toEqual(1)
  })

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
