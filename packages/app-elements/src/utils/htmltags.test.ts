import { removeUnwantedProps } from './htmltags'

describe('removeUnwantedProps', () => {
  const props = {
    a: '',
    b: '',
    c: ''
  }

  const cleanedProps = removeUnwantedProps(props, ['c'])

  it("should return the original set of props without the prop 'c'", () => {
    expect(cleanedProps).toEqual({
      a: '',
      b: ''
    })
  })
})
