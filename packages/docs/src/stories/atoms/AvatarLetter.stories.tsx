import { AvatarLetter } from '#ui/atoms/AvatarLetter'
import { BG_COLORS } from '#ui/atoms/AvatarLetter/colors'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof AvatarLetter> = {
  title: 'Atoms/AvatarLetter',
  component: AvatarLetter
}
export default setup

const Template: StoryFn<typeof AvatarLetter> = (args) => (
  <AvatarLetter {...args} />
)

export const Default = Template.bind({})
Default.args = {
  text: 'Commerce Layer'
}

/** When the `text` is composed of more than one word, it will use the initials from the first two words. */
export const Initials = Template.bind({})
Initials.args = {
  text: 'Commerce Layer'
}

/** When the `text` is composed of one single word, it will use the first two chars of the text. */
export const SingleWorld = Template.bind({})
SingleWorld.args = {
  text: 'Doe'
}

/** Access to internal values with children props. */
export const ChildrenProps: StoryFn<typeof AvatarLetter> = () => (
  <AvatarLetter text='John Doe'>
    {({ initials, backgroundColor, textColor }) => (
      <pre>
        {JSON.stringify({ initials, backgroundColor, textColor }, null, 2)}
      </pre>
    )}
  </AvatarLetter>
)

/** This is the list of all available background colors. You cannot choose the background; it is calculated based on the given `text`. */
export const AvailableBackgroundColors: StoryFn = (_args) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
        gap: '2.5rem'
      }}
    >
      {BG_COLORS.map((hex, index) => (
        <div
          key={hex}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '.5rem'
          }}
        >
          <AvatarLetter text={getText(index)} />
          <div style={{ color: '#686e6e', fontSize: '.75rem' }}>
            {hex.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  )
}
AvailableBackgroundColors.parameters = {
  layout: 'padded',
  docs: {
    canvas: {
      // This will remove the "show code" button
      // https://storybook.js.org/docs/api/doc-blocks/doc-block-canvas#sourcestate
      sourceState: 'none'
    }
  }
}

function getText(index: number): string {
  const multiplier = Math.ceil(65 / BG_COLORS.length)

  if (BG_COLORS.length * multiplier + index > 90) {
    return String.fromCharCode(
      BG_COLORS.length * (multiplier - 1) + index,
      BG_COLORS.length * multiplier
    )
  }

  return String.fromCharCode(
    BG_COLORS.length * multiplier + index,
    BG_COLORS.length * multiplier
  )
}
