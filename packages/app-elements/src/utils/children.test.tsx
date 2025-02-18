import { isSpecificJsxTag } from '#utils/children'
import { type JSX } from 'react'
import {
  filterByDisplayName,
  getInnerText,
  isSpecificReactComponent
} from './children'

function createElement(
  displayName: string,
  props?: Record<string, unknown>
): JSX.Element {
  const SampleComponent = (): JSX.Element => <div />
  SampleComponent.displayName = displayName

  return <SampleComponent {...props} />
}

describe('isSpecificReactComponent', () => {
  it('should return `true` for matched named component', () => {
    expect(
      isSpecificReactComponent(createElement('Button'), [/^Button$/])
    ).toBe(true)
  })

  it('should return `false` for not matched named component', () => {
    expect(isSpecificReactComponent(createElement('Title'), [/^Button$/])).toBe(
      false
    )
  })

  it('should return `false` for null child', () => {
    expect(isSpecificReactComponent(null, [/^Button$/])).toBe(false)
  })

  it('should return `false` for any other ReactNode element', () => {
    expect(
      isSpecificReactComponent('string is a valid ReactNode', [/^Button$/])
    ).toBe(false)
  })
})

describe('isSpecificJsxTag', () => {
  it('should return `true` for matched named component as jsx element', () => {
    expect(isSpecificJsxTag(<button>foo</button>, ['button'])).toBe(true)
  })

  it('should return `false` for not matched named component', () => {
    expect(isSpecificJsxTag(<div>foo</div>, ['button'])).toBe(false)
  })
})

describe('filterByDisplayName', () => {
  it('should return all children with the given displayName', () => {
    const container = (
      <div>
        <div>{createElement('Input', { id: '1' })}</div>
        <div>{createElement('HookedInput', { id: '2' })}</div>
        <div>
          <div>{createElement('HookedInput', { id: '3' })}</div>
        </div>
        {createElement('Button', { type: 'submit', children: 'Submit' })}
      </div>
    )
    expect(filterByDisplayName(container, /^Hooked/)).toMatchInlineSnapshot(`
      [
        <HookedInput
          id="2"
        />,
        <HookedInput
          id="3"
        />,
      ]
    `)
  })
})

describe('getInnerText', () => {
  it('should extract the innerText from a ReactNode', () => {
    expect(getInnerText(<div>Ehi there!</div>)).toEqual('Ehi there!')
    expect(
      getInnerText(
        <>
          <i className='icon' />
          <b>Ehi</b> there!
        </>
      )
    ).toEqual('Ehi there!')
  })
})
