import { render } from '@testing-library/react'
import { Section } from './Section'

describe('Legend', () => {
  it('Should be rendered', () => {
    const { getByLabelText } = render(
      <Section title='Hello world' actionButton={<button>Click me</button>}>
        My section content!
      </Section>
    )

    expect(getByLabelText('Hello world')).toBeInTheDocument()
  })

  it('Should render as a <section> when title is defined', () => {
    const { container, getByRole } = render(
      <Section title='Hello world' actionButton={<button>Click me</button>}>
        My section content!
      </Section>
    )

    const [element] = container.children
    assertToBeDefined(element)

    expect(getByRole('banner')).toBeVisible()
    expect(getByRole('banner').children.length).toEqual(2)
    expect(getByRole('heading').tagName).toEqual('H2')

    expect(container.children.length).toEqual(1)
    expect(element).toBeVisible()
    expect(element.tagName).toEqual('SECTION')
    expect(element).toHaveAttribute('aria-label', 'Hello world')
  })

  it('Should get the innerText from the `title` prop and set a valid `aria-label`', () => {
    const { getByRole } = render(
      <Section
        title={
          <div>
            This <b>is</b> <span style={{ color: 'red' }}>the title</span>!
          </div>
        }
      >
        My section content!
      </Section>
    )

    expect(getByRole('region')).toHaveAttribute(
      'aria-label',
      'This is the title!'
    )
  })

  it('Should render as a <div> when title is NOT defined', () => {
    const { container, getByRole, queryByRole } = render(
      <Section actionButton={<button>Click me</button>}>
        My section content!
      </Section>
    )

    const [element] = container.children
    assertToBeDefined(element)

    expect(getByRole('banner')).toBeVisible()
    expect(getByRole('banner').children.length).toEqual(1)
    expect(queryByRole('heading')).toBeNull()

    expect(container.children.length).toEqual(1)
    expect(element).toBeVisible()
    expect(element.tagName).toEqual('DIV')
    expect(element).not.toHaveAttribute('aria-label')
  })

  it('Should NOT render the header when `title` and `actionButton` are not defined', () => {
    const { container, queryByRole } = render(
      <Section>My section content!</Section>
    )

    const [element] = container.children
    assertToBeDefined(element)

    expect(queryByRole('banner')).toBeNull()
    expect(queryByRole('heading')).toBeNull()

    expect(container.children.length).toEqual(1)
    expect(element).toBeVisible()
    expect(element.tagName).toEqual('DIV')
    expect(element).not.toHaveAttribute('aria-label')
  })
})
