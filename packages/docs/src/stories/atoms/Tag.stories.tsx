import type { Meta, StoryFn } from "@storybook/react-vite"
import { Tag } from "#ui/atoms/Tag"

const setup: Meta<typeof Tag> = {
  title: "Atoms/Tag",
  component: Tag,
}
export default setup

const Template: StoryFn<typeof Tag> = (args) => <Tag {...args}>logo-pink</Tag>

export const Default = Template.bind({})

/**
 * This component uses the CSS `overflow-wrap: anywhere` property to prevent text from overflowing its line box.
 */
export const WrapAnywhere = () => (
  <>
    <Tag>
      this:is:a:long:text:that:should:break:because:we:are:using:the:break:all:css:property:is:it:breaking?:can:you:read:this:text?
    </Tag>
    <br />
    <Tag>
      this-is-a-long-text-that-should-break-because-we-are-using-the-break-all-css-property-is-it-breaking?-can-you-read-this-text?
    </Tag>
    <br />
    <Tag>
      this_is_a_long_text_that_should_break_because_we_are_using_the_break_all_css_property_is_it_breaking?_can_you_read_this_text?
    </Tag>
    <br />
    <Tag>
      this is a long text that should break because we are using the break all
      css property is it breaking? can you read this text?
    </Tag>
  </>
)
