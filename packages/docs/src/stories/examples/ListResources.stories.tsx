import {
  Description,
  Primary,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks"
import type { Meta, StoryFn } from "@storybook/react-vite"
import { Spacer } from "#ui/atoms/Spacer"
import { StatusIcon } from "#ui/atoms/StatusIcon"
import { Text } from "#ui/atoms/Text"
import { List } from "#ui/composite/List"
import { ListItem } from "#ui/composite/ListItem"
import { PageLayout } from "#ui/composite/PageLayout"

const setup: Meta = {
  title: "Examples/List Resources",
  parameters: {
    layout: "fullscreen",
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
        </>
      ),
    },
  },
}
export default setup

const Template: StoryFn<typeof List> = (_args) => (
  <PageLayout
    title="Resources"
    navigationButton={{
      label: "Back to dashboard",
      onClick: () => {
        alert("Back to dashboard")
      },
    }}
  >
    <Spacer bottom="14">
      <List
        title="All resources"
        pagination={{
          recordsPerPage: 200,
          recordCount: 104,
          currentPage: 1,
          onChangePageRequest: (_newPage: number) => {},
          pageCount: 1,
        }}
      >
        {[
          "Customers",
          "Events",
          "Exports",
          "Gift cards",
          "Orders",
          "Prices",
          "Shipments",
          "SKUs",
          "SKU lists",
          "Tax rules",
          "Wire transfers",
        ].map((resource) => (
          <ListItem key={resource} href="#">
            <Text weight="semibold">{resource}</Text>
            <StatusIcon name="caretRight" />
          </ListItem>
        ))}
      </List>
    </Spacer>
  </PageLayout>
)

export const Default = Template.bind({})
