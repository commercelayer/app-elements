import { CoreSdkProvider } from '#providers/CoreSdkProvider'
import { MockTokenProvider as TokenProvider } from '#providers/TokenProvider/MockTokenProvider'
import { Text } from '#ui/atoms/Text'
import { FlexRow } from '#ui/internals/FlexRow'
import { LineItems } from '#ui/resources/LineItems'
import { presetLineItems } from '#ui/resources/LineItems.mocks'
import { type Meta, type StoryFn } from '@storybook/react'

type Props = Parameters<typeof LineItems>[0] & {
  preset: Array<keyof typeof presetLineItems | 'custom'>
}

const setup: Meta<Props> = {
  title: 'Resources/Order LineItems',
  component: LineItems,
  argTypes: {
    preset: {
      options: ['custom', ...Object.keys(presetLineItems)],
      control: { type: 'check' },
      description: `⚠️ This attribute is **not** a component prop.
        It is meant to be used only within this documentation.
        You can quickly switch to a pre-configured \`lineItem\`.
      `,
      defaultValue: ['custom']
    }
  },
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<Props> = ({ preset, items, ...args }) => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <LineItems
          {...args}
          items={[
            ...(preset.includes('custom') ? items : []),
            ...preset
              .filter(
                (p): p is Exclude<Props['preset'][number], 'custom'> =>
                  p !== 'custom'
              )
              .map((p) => presetLineItems[p])
          ]}
        />
      </CoreSdkProvider>
    </TokenProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  preset: ['custom'],
  isLoading: false,
  items: [presetLineItems.oneLine],
  footer: (
    <>
      <FlexRow>
        <Text>Subtotal</Text>
        <Text>$141.60</Text>
      </FlexRow>
      <FlexRow className='my-4'>
        <Text>Shipping method</Text>
        <Text>$12.00</Text>
      </FlexRow>
      <FlexRow>
        <Text weight='bold'>Total</Text>
        <Text weight='bold'>$163.60</Text>
      </FlexRow>
    </>
  )
}

export const Multi: StoryFn<Props> = () => {
  return (
    <TokenProvider kind='integration' appSlug='orders' devMode>
      <CoreSdkProvider>
        <LineItems items={Object.values(presetLineItems)} />
      </CoreSdkProvider>
    </TokenProvider>
  )
}
