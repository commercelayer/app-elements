import { getInnerText, isSpecificReactComponent } from './children'

function makeChildWithName(displayName: string): JSX.Element {
  const SampleComponent = (): JSX.Element => <div />
  SampleComponent.displayName = displayName

  return <SampleComponent />
}

describe('isSpecificReactComponent', () => {
  it('should return `true` for matched named component', () => {
    expect(
      isSpecificReactComponent(makeChildWithName('Button'), ['Button'])
    ).toBe(true)
  })

  it('should return `false` for not matched named component', () => {
    expect(
      isSpecificReactComponent(makeChildWithName('Title'), ['Button'])
    ).toBe(false)
  })

  it('should return `false` for null child', () => {
    expect(isSpecificReactComponent(null, ['Button'])).toBe(false)
  })

  it('should return `false` for any other ReactNode element', () => {
    expect(
      isSpecificReactComponent('string is a valid ReactNode', ['Button'])
    ).toBe(false)
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
