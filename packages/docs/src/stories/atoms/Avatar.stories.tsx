import { Avatar } from '#ui/atoms/Avatar'
import { presets } from '#ui/atoms/Avatar.utils'
import { humanizeString } from '#utils/text'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  decorators: [
    (Story) => (
      <div className='flex gap-1 flex-wrap'>
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof Avatar> = (args) => <Avatar {...args} />

export const Default = Template.bind({})
Default.args = {
  src: 'https://data.commercelayer.app/assets/logos/glyph/white/commercelayer_glyph_white-padding.jpg',
  alt: 'Commerce Layer',
  shape: 'circle'
}

/** Usually a SKU image is represented with a rounder shape. */
export const SkuImage = Template.bind({})
SkuImage.args = {
  src: 'https://res.cloudinary.com/commercelayer/image/upload/f_auto,b_white/demo-store/skus/BASEBHAT000000FFFFFFXXXX_FLAT.png',
  alt: 'Hat'
}

/** When `src` prop is not set, then a placeholder will be shown. */
export const UndefinedSource = Template.bind({})
UndefinedSource.args = {
  alt: 'The image is not present'
}

/** The image is scaled to maintain its aspect ratio while fitting within the element's content box. */
export const AspectRatio: StoryFn = (_args) => {
  return (
    <>
      <Avatar src='https://via.placeholder.com/50x80' alt='Portrait' />
      <Avatar src='https://via.placeholder.com/80x50' alt='Landscape' />
      <Avatar src='https://via.placeholder.com/40x40' alt='Small' />
    </>
  )
}

/** List of all available payment icons. */
export const Payments: StoryFn = (_args) => renderPresetGroup('payments:')

/** List of all available carrier icons. */
export const Carriers: StoryFn = (_args) => renderPresetGroup('carriers:')

/** Gift card icon is currently available only with `shape="rounded"`. */
export const GiftCard: StoryFn = (_args) => {
  return <Avatar src='gift_card' alt='Gift Card' shape='rounded' />
}

function renderPresetGroup(groupKey: string): JSX.Element {
  return (
    <>
      {(Object.keys(presets) as Array<keyof typeof presets>)
        .filter((p) => p.startsWith(groupKey))
        .map((src) => (
          <Avatar
            key={src}
            src={src}
            shape='circle'
            alt={humanizeString(src.replace(groupKey, ''))}
          />
        ))}
    </>
  )
}
