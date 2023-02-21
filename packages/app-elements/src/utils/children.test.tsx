import { Children } from 'react'
import { isSpecificReactComponent } from './children'

const SampleComponent = <div>foo</div>
function makeChildWithName(displayName: string): JSX.Element[] {
  return Children.map([SampleComponent], (child) => ({
    ...child,
    type: {
      ...child.type,
      displayName
    }
  }))
}

describe('isSpecificReactComponent', () => {
  test('should return `true` for matched named component', () => {
    expect(
      isSpecificReactComponent(makeChildWithName('Button')[0], 'Button')
    ).toBe(true)
  })

  test('should return `false` for not matched named component', () => {
    expect(
      isSpecificReactComponent(makeChildWithName('Title')[0], 'Button')
    ).toBe(false)
  })

  test('should return `false` for null child', () => {
    expect(isSpecificReactComponent(null, 'Button')).toBe(false)
  })

  test('should return `false` for any other ReactNode element', () => {
    expect(
      isSpecificReactComponent('string is a valid ReactNode', 'Button')
    ).toBe(false)
  })
})
