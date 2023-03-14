import { isSpecificReactComponent } from './children'

function makeChildWithName(displayName: string): JSX.Element {
  const SampleComponent = (): JSX.Element => <div />
  SampleComponent.displayName = displayName

  return <SampleComponent />
}

describe('isSpecificReactComponent', () => {
  test('should return `true` for matched named component', () => {
    expect(
      isSpecificReactComponent(makeChildWithName('Button'), ['Button'])
    ).toBe(true)
  })

  test('should return `false` for not matched named component', () => {
    expect(
      isSpecificReactComponent(makeChildWithName('Title'), ['Button'])
    ).toBe(false)
  })

  test('should return `false` for null child', () => {
    expect(isSpecificReactComponent(null, ['Button'])).toBe(false)
  })

  test('should return `false` for any other ReactNode element', () => {
    expect(
      isSpecificReactComponent('string is a valid ReactNode', ['Button'])
    ).toBe(false)
  })
})
