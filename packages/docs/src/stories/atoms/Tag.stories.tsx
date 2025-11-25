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
 * This component integrates an automatic behavior of truncating text content longer than 15 characters and displaying a tooltip with the full content on hover.
 */
export const TooltipIntegrated = () => (
  <>
    <Tag key="tag-0">
      this:is:a:long:text:that:should:break:because:we:are:using:the:break:all:css:property:is:it:breaking?:can:you:read:this:text?
    </Tag>
    <br />
    <Tag key="tag-1">
      this-is-a-long-text-that-should-break-because-we-are-using-the-break-all-css-property-is-it-breaking?-can-you-read-this-text?
    </Tag>
    <br />
    <Tag key="tag-2">
      this_is_a_long_text_that_should_break_because_we_are_using_the_break_all_css_property_is_it_breaking?_can_you_read_this_text?
    </Tag>
    <br />
    <Tag key="tag-3">
      this is a long text that should break because we are using the break all
      css property is it breaking? can you read this text?
    </Tag>
  </>
)
