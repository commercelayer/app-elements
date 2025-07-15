import { Button } from '#ui/atoms/Button'
import { ToastContainer, toast } from '#ui/composite/Toast'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof ToastContainer> = {
  title: 'Composite/Toast (notifications)',
  component: ToastContainer,
  parameters: {
    layout: 'padded'
  },
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '50px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

export const Default: StoryFn = () => {
  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-2'>
        <Button
          className='w-fit'
          alignItems='center'
          size='regular'
          variant='secondary'
          onClick={() => toast('Hi there!')}
        >
          default
        </Button>
        <Button
          className='w-fit'
          alignItems='center'
          size='regular'
          variant='secondary'
          onClick={() => toast('Changes saved!', { type: 'success' })}
        >
          Success
        </Button>
        <Button
          className='w-fit'
          alignItems='center'
          size='regular'
          variant='secondary'
          onClick={() => toast('Something went wrong!', { type: 'error' })}
        >
          Error
        </Button>
        <Button
          className='w-fit'
          alignItems='center'
          size='regular'
          variant='secondary'
          onClick={() =>
            toast(
              'Condition invalid condition matcher: arry_match. Must be one of: start_with, not_start_with, end_with, not_end_with, does_not_match, matches, multiple, eq, not_eq, lt, lteq, gt, gteq, blank, present, null, not_null, gt_lt, gteq_lt, gt_lteq, gteq_lteq, is_in, is_not_in, array_match. in the rule 50% promo EU.',
              { type: 'error' }
            )
          }
        >
          Long message
        </Button>
      </div>
    </>
  )
}
