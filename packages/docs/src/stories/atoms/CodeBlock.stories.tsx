import { useOverlay } from '#hooks/useOverlay'
import { Button } from '#ui/atoms/Button'
import { CodeBlock } from '#ui/atoms/CodeBlock'
import { PageHeading } from '#ui/atoms/PageHeading'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof CodeBlock> = {
  title: 'Atoms/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'padded'
  },
  args: {
    children: '',
    label: '',
    hint: undefined,
    showCopyAction: false,
    showSecretAction: false
  }
}
export default setup

const Template: StoryFn<typeof CodeBlock> = (args) => {
  return <CodeBlock {...args}>{args.children}</CodeBlock>
}

export const Default = Template.bind({})
Default.args = {
  children: `commercelayer app:login \\
      -i asdGvqXsOSsdko6ueiX9 \\
      -s elyFpGvqXsOSss2Ua4No1_HxaKH_0rUsFuYiX9 \\
      -o demo-store \\
      -a admin`,
  showCopyAction: true
}

/**
 * This component will break long strings by relying on native CSS behaviors.
 */
export const LongSingleLine = Template.bind({})
LongSingleLine.args = {
  label: 'Login with your admin credentials',
  children:
    'commercelayer app:login -i asdGvqXsOSsdko6ueiX9 -s elyFpGvqXsOSss2Ua4No1_HxaKH_0rUsFuYiX9 -o demo-store -a admin',
  showCopyAction: true
}

/**
 * This component can be used to hide (from the screen) sensitive information like API keys or secrets.
 */
export const Secret = Template.bind({})
Secret.args = {
  label: 'Secret',
  children: 'elyFpGvqXsOSsvEko6ues2Ua4No1_HxaKH_0rUaFuYiX9',
  showCopyAction: true,
  showSecretAction: true
}

/**
 * In this example we are using the `children` prop to render a code snippet with multi-line content.
 * Special characters like `\` need to be escaped with `\\` to be rendered correctly.
 */

export const MultiLineSecret: StoryFn = () => {
  return (
    <CodeBlock
      label='Login with your admin credentials'
      showCopyAction
      showSecretAction
    >
      {`commercelayer app:login \\
      -i asdGvqXsOSsdko6ueiX9 \\
      -s elyFpGvqXsOSss2Ua4No1_HxaKH_0rUsFuYiX9 \\
      -o demo-store \\
      -a admin`}
    </CodeBlock>
  )
}

export const WithHint = Template.bind({})
WithHint.args = {
  label: 'Secret',
  children: 'asd6as78d6asds',
  hint: { text: 'Do not share this secret with others' }
}

export const Loading = Template.bind({})
Loading.args = {
  label: 'Secret',
  children: 'asd6as78d6asds',
  isLoading: true,
  hint: { text: 'Do not share this secret with others' }
}

/**
 * This component can be used inside an overlay without having to customize the background color.
 */
export const UsageInsideOverlay: StoryFn = () => {
  const { Overlay, open, close } = useOverlay()

  return (
    <div>
      <Button onClick={open}>Open overlay</Button>
      <Overlay backgroundColor='light'>
        <PageHeading
          title='Your credentials'
          navigationButton={{
            label: 'Close',
            icon: 'x',
            onClick: () => {
              close()
            }
          }}
        />
        <CodeBlock
          label='Login with your admin credentials'
          showCopyAction
          showSecretAction
        >
          {`commercelayer app:login \\
          -i asdGvqXsOSsdko6ueiX9 \\
          -s elyFpGvqXsOSss2Ua4No1_HxaKH_0rUsFuYiX9 \\
          -o demo-store \\
          -a admin`}
        </CodeBlock>
      </Overlay>
    </div>
  )
}
