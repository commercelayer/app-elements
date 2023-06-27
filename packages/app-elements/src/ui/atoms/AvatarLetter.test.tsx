import { render } from '@testing-library/react'
import { AvatarLetter } from './AvatarLetter'

describe('AvatarLetter', () => {
  it('should render', () => {
    const { getByText } = render(<AvatarLetter text='Jon Doe' />)
    expect(getByText('JD')).toBeInTheDocument()
  })
})
